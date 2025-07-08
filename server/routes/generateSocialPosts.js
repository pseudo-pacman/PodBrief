const express = require('express');
const OpenAI = require('openai');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/generate-social-posts
router.post('/', async (req, res) => {
  const { guestName, episodeTopic, bio, quote, postTypes } = req.body;
  if (!guestName || !episodeTopic || !bio || !Array.isArray(postTypes) || postTypes.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  let prompt = `You are a social media strategist for a podcast.\n\nGuest: ${guestName}\nTopic: ${episodeTopic}\nBio: ${bio}`;
  if (quote) prompt += `\nQuote: \"${quote}\"`;
  prompt += '\n\nGenerate the following:';
  if (postTypes.includes('twitter')) {
    prompt += '\n1. A Twitter/X thread (3–5 tweets max) that summarizes the key takeaways and hooks the audience.';
  }
  if (postTypes.includes('linkedin')) {
    prompt += '\n2. A LinkedIn post (2–3 short paragraphs) suitable for professional audiences.';
  }
  if (postTypes.includes('instagram')) {
    prompt += '\n3. An Instagram caption with a quote and CTA.';
  }
  prompt += '\n\nKeep each output short, friendly, and ready to publish.';

  try {
    let aiResponse;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a social media strategist for a podcast.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 700,
        temperature: 0.8
      });
      aiResponse = response.choices[0].message.content.trim();
    } catch (err) {
      // Fallback to 3.5-turbo
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a social media strategist for a podcast.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 700,
        temperature: 0.8
      });
      aiResponse = response.choices[0].message.content.trim();
    }

    // Parse the AI response into the expected JSON structure
    const posts = { twitter: [], linkedin: '', instagram: '' };
    // Twitter thread
    if (postTypes.includes('twitter')) {
      const twitterMatch = aiResponse.match(/Twitter.*?:([\s\S]*?)(?=LinkedIn|Instagram|$)/i);
      if (twitterMatch) {
        // Split into tweets by line or number
        const tweets = twitterMatch[1].split(/\n+|\d+\. /).map(t => t.trim()).filter(Boolean);
        posts.twitter = tweets;
      }
    }
    // LinkedIn
    if (postTypes.includes('linkedin')) {
      const linkedinMatch = aiResponse.match(/LinkedIn.*?:([\s\S]*?)(?=Instagram|Twitter|$)/i);
      if (linkedinMatch) {
        posts.linkedin = linkedinMatch[1].trim();
      }
    }
    // Instagram
    if (postTypes.includes('instagram')) {
      const igMatch = aiResponse.match(/Instagram.*?:([\s\S]*)/i);
      if (igMatch) {
        posts.instagram = igMatch[1].trim();
      }
    }

    res.json({ success: true, posts });
  } catch (err) {
    console.error('Error generating social posts:', err);
    res.status(500).json({ success: false, error: 'Failed to generate social posts.' });
  }
});

module.exports = router; 