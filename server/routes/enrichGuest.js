const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const OpenAI = require('openai');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: fetch and extract visible text from a URL
async function fetchPageText(url) {
  try {
    const res = await fetch(url, { timeout: 15000 });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    // Remove script/style/noscript
    $('script, style, noscript').remove();
    // Get visible text
    const text = $('body').text();
    // Clean up whitespace
    return text.replace(/\s+/g, ' ').trim();
  } catch (err) {
    return '';
  }
}

// Helper: OpenAI call with fallback
async function enrichWithOpenAI(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a smart podcast assistant. Always respond in valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700,
      temperature: 0.6
    });
    return response.choices[0].message.content;
  } catch (err) {
    if (err.message && err.message.includes('gpt-4')) {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a smart podcast assistant. Always respond in valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 700,
        temperature: 0.6
      });
      return response.choices[0].message.content;
    }
    throw err;
  }
}

// POST /api/enrich-guest
router.post('/', async (req, res) => {
  const { linkedin, website, interviews } = req.body;
  if (!linkedin && !website && (!interviews || interviews.length === 0)) {
    return res.status(400).json({ success: false, error: 'At least one URL is required.' });
  }
  try {
    // Fetch and combine text from all URLs
    const urls = [linkedin, website, ...(interviews || [])].filter(Boolean);
    const texts = await Promise.all(urls.map(fetchPageText));
    const combinedPageText = texts.filter(Boolean).join('\n\n');
    if (!combinedPageText || combinedPageText.length < 100) {
      return res.status(400).json({ success: false, error: 'Could not extract enough information from the provided URLs.' });
    }
    // Build prompt
    const prompt = `You are a smart podcast assistant. Based on the following URLs (LinkedIn, personal website, and past interviews), extract and summarize:\n- Full name\n- Title / Role\n- Company\n- 2-sentence professional bio\n- Key topics they frequently discuss\n- Any memorable quotes or ideas\n\nContent:\n${combinedPageText}\n\nReturn a JSON object with keys: name, title, company, bio, topics (array), quote (optional).`;
    // Call OpenAI
    const aiResponse = await enrichWithOpenAI(prompt);
    let enrichment;
    try {
      enrichment = JSON.parse(aiResponse);
    } catch (err) {
      // Try to extract JSON from text
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        enrichment = JSON.parse(match[0]);
      } else {
        throw new Error('AI response was not valid JSON');
      }
    }
    res.json({ success: true, enrichment });
  } catch (err) {
    console.error('Error enriching guest:', err);
    res.status(500).json({ success: false, error: 'Failed to enrich guest info.' });
  }
});

module.exports = router; 