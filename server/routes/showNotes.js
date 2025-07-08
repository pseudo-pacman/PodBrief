const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate input
function validateShowNotesInput(req, res, next) {
  const { guestName, bio, topic, questions, links } = req.body;
  if (!guestName || !bio || !topic || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }
  next();
}

// Helper to call OpenAI with fallback
async function generateShowNotesWithFallback(payload, prompt) {
  // Try GPT-4 first
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a professional podcast show notes writer. Always respond in Markdown.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 900,
      temperature: 0.7
    });
    return response.choices[0].message.content;
  } catch (err) {
    // If GPT-4 is not available, fall back to 3.5-turbo
    if (err.message && err.message.includes('model') && err.message.includes('gpt-4')) {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional podcast show notes writer. Always respond in Markdown.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 900,
        temperature: 0.7
      });
      return response.choices[0].message.content;
    }
    throw err;
  }
}

// POST /api/generate-show-notes
router.post('/', validateShowNotesInput, async (req, res) => {
  const { guestName, bio, topic, questions, links } = req.body;
  const prompt = `Write SEO-optimized podcast show notes for an episode featuring guest ${guestName}. Use the following info:\n- Bio: ${bio}\n- Topic: ${topic}\n- Interview Questions: ${questions.join("\n")}\n- Guest Links: ${links && links.length ? links.join(", ") : "None"}\n\nInclude:\n- A short 2–3 sentence summary of the episode\n- 3–5 key takeaways (bulleted list)\n- A guest info section (with links)\n- A brief call to action for the listener`;
  try {
    const showNotes = await generateShowNotesWithFallback(req.body, prompt);
    res.json({ success: true, showNotes });
  } catch (error) {
    console.error('Error generating show notes:', error);
    res.status(500).json({ success: false, error: 'Failed to generate show notes.' });
  }
});

module.exports = router; 