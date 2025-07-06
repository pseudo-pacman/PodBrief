const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { YoutubeTranscript } = require('youtube-transcript-api');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validation middleware
const validateContextualizeData = (req, res, next) => {
  const { bioUrl, interviewUrls } = req.body;
  
  if (bioUrl && typeof bioUrl !== 'string') {
    return res.status(400).json({
      error: 'Bio URL must be a string'
    });
  }
  
  if (interviewUrls && !Array.isArray(interviewUrls)) {
    return res.status(400).json({
      error: 'Interview URLs must be an array'
    });
  }
  
  // Clean the data
  req.body.bioUrl = bioUrl ? bioUrl.trim() : null;
  req.body.interviewUrls = interviewUrls ? interviewUrls.filter(url => url.trim()) : [];
  
  next();
};

// Scrape webpage content
async function scrapeWebpage(url) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    
    // Extract text content
    const content = await page.evaluate(() => {
      // Remove script and style elements
      const scripts = document.querySelectorAll('script, style, nav, footer, header');
      scripts.forEach(el => el.remove());
      
      // Get main content areas
      const mainContent = document.querySelector('main, article, .content, .post, .entry') || document.body;
      return mainContent.innerText || document.body.innerText;
    });
    
    await browser.close();
    return content;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
}

// Extract YouTube transcript
async function extractYouTubeTranscript(url) {
  try {
    // Extract video ID from YouTube URL
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL');
    }
    
    const videoId = videoIdMatch[1];
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Combine all transcript parts
    return transcript.map(part => part.text).join(' ');
  } catch (error) {
    console.error(`Error extracting YouTube transcript:`, error.message);
    return null;
  }
}

// Summarize content using OpenAI
async function summarizeContent(content, type) {
  try {
    const prompt = type === 'bio' 
      ? `Summarize the following professional content into a 2-3 sentence professional bio. Focus on key achievements, expertise, and background:\n\n${content.substring(0, 3000)}`
      : `Summarize the following interview content into 3-5 key themes or insights. Format as bullet points:\n\n${content.substring(0, 3000)}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content summarizer. Provide concise, accurate summaries.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error summarizing content:', error.message);
    return null;
  }
}

// POST /api/contextualizeGuest - Extract context from URLs
router.post('/', validateContextualizeData, async (req, res) => {
  try {
    const { bioUrl, interviewUrls } = req.body;
    const errors = [];
    let bioSummary = null;
    const interviewInsights = [];
    
    console.log(`Contextualizing guest with bio URL: ${bioUrl}, interview URLs: ${interviewUrls.length}`);
    
    // Process bio URL if provided
    if (bioUrl) {
      try {
        const bioContent = await scrapeWebpage(bioUrl);
        if (bioContent) {
          bioSummary = await summarizeContent(bioContent, 'bio');
          if (!bioSummary) {
            errors.push(`Failed to summarize bio content from ${bioUrl}`);
          }
        } else {
          errors.push(`Failed to scrape content from bio URL: ${bioUrl}`);
        }
      } catch (error) {
        errors.push(`Error processing bio URL ${bioUrl}: ${error.message}`);
      }
    }
    
    // Process interview URLs
    for (const url of interviewUrls) {
      try {
        let content = null;
        
        // Determine URL type and extract content accordingly
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          content = await extractYouTubeTranscript(url);
        } else {
          content = await scrapeWebpage(url);
        }
        
        if (content) {
          const insight = await summarizeContent(content, 'interview');
          if (insight) {
            interviewInsights.push({
              url,
              insight
            });
          } else {
            errors.push(`Failed to summarize content from ${url}`);
          }
        } else {
          errors.push(`Failed to extract content from ${url}`);
        }
      } catch (error) {
        errors.push(`Error processing interview URL ${url}: ${error.message}`);
      }
    }
    
    const result = {
      bioSummary,
      interviewInsights: interviewInsights.map(item => item.insight),
      errors: errors.length > 0 ? errors : undefined
    };
    
    console.log(`✅ Contextualization completed. Bio summary: ${!!bioSummary}, Interview insights: ${interviewInsights.length}`);
    
    res.json(result);
  } catch (error) {
    console.error('Error in contextualize endpoint:', error);
    res.status(500).json({
      error: 'Failed to contextualize guest information',
      details: error.message
    });
  }
});

module.exports = router; 