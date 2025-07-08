const express = require('express');
const OpenAI = require('openai');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/assist-question
router.post('/', async (req, res) => {
  const { topic, originalQuestion, mode, tone } = req.body;
  if (!topic || !originalQuestion || !mode) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }
  let prompt;
  if (mode === 'regenerate') {
    prompt = `Regenerate the following podcast interview question for a guest discussing "${topic}". Keep it engaging and relevant:\n"${originalQuestion}"`;
  } else if (mode === 'refine') {
    prompt = `Improve the following podcast interview question to be more ${tone || 'personal'} (e.g., personal, thought-provoking, funny, bold) while keeping it on-topic:\n"${originalQuestion}"`;
  } else {
    return res.status(400).json({ success: false, error: 'Invalid mode.' });
  }
  try {
    let aiResponse;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a podcast interview question expert. Always respond with only the improved or regenerated question.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.7
      });
      aiResponse = response.choices[0].message.content.trim();
    } catch (err) {
      // Fallback to 3.5-turbo
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a podcast interview question expert. Always respond with only the improved or regenerated question.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.7
      });
      aiResponse = response.choices[0].message.content.trim();
    }
    // Remove quotes if present
    if (aiResponse.startsWith('"') && aiResponse.endsWith('"')) {
      aiResponse = aiResponse.slice(1, -1);
    }
    res.json({ success: true, question: aiResponse });
  } catch (err) {
    console.error('Error assisting question:', err);
    res.status(500).json({ success: false, error: 'Failed to assist question.' });
  }
});

module.exports = router; 