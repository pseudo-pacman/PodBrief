const express = require('express');
const OpenAI = require('openai');
const { db } = require('../database/init');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validation middleware
const validateGuestData = (req, res, next) => {
  const { name, link, topic, interviewStyle, bioSummary, interviewInsights } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Name is required and must be a non-empty string'
    });
  }
  
  if (link && typeof link !== 'string') {
    return res.status(400).json({
      error: 'Link must be a string'
    });
  }
  
  if (topic && typeof topic !== 'string') {
    return res.status(400).json({
      error: 'Topic must be a string'
    });
  }
  
  if (interviewStyle && typeof interviewStyle !== 'string') {
    return res.status(400).json({
      error: 'Interview style must be a string'
    });
  }
  
  if (bioSummary && typeof bioSummary !== 'string') {
    return res.status(400).json({
      error: 'Bio summary must be a string'
    });
  }
  
  if (interviewInsights && !Array.isArray(interviewInsights)) {
    return res.status(400).json({
      error: 'Interview insights must be an array'
    });
  }
  
  // Clean the data
  req.body.name = name.trim();
  req.body.link = link ? link.trim() : null;
  req.body.topic = topic ? topic.trim() : null;
  req.body.interviewStyle = interviewStyle || 'Professional';
  req.body.bioSummary = bioSummary ? bioSummary.trim() : null;
  req.body.interviewInsights = interviewInsights || [];
  
  next();
};

// Generate brief using OpenAI
async function generateBriefWithAI(guestData) {
  const { name, link, topic, interviewStyle, bioSummary, interviewInsights } = guestData;
  
  // Build context for the prompt
  let context = `Generate a professional podcast interview brief for ${name}`;
  if (link) {
    context += ` (${link})`;
  }
  if (topic) {
    context += ` who will be discussing ${topic}`;
  }
  
  // Add contextual information if available
  let additionalContext = '';
  if (bioSummary) {
    additionalContext += `\n\nProfessional Background: ${bioSummary}`;
  }
  if (interviewInsights && interviewInsights.length > 0) {
    additionalContext += `\n\nPrevious Interview Insights:\n${interviewInsights.map(insight => `• ${insight}`).join('\n')}`;
  }
  
  // Define tone instructions based on interview style
  const toneInstructions = {
    'Professional': 'Write in a formal, business-like tone with professional language and structure.',
    'Casual': 'Write in a relaxed, conversational tone that feels natural and friendly.',
    'Entertainer': 'Write in a fun, engaging tone that is entertaining and keeps listeners hooked.',
    'Thought Leader': 'Write in an intellectual, insightful tone that demonstrates deep thinking and expertise.'
  };
  
  const toneInstruction = toneInstructions[interviewStyle] || toneInstructions['Professional'];
  
  const prompt = `${context}.${additionalContext}

${toneInstruction} Please provide the following in JSON format:

1. A professional bio (2-3 sentences) that introduces the guest professionally${bioSummary ? ' (incorporate the provided background information)' : ''}
2. 5 engaging interview questions that would be interesting for podcast listeners${interviewInsights && interviewInsights.length > 0 ? ' (draw from the previous interview insights to avoid repetition and build on existing themes)' : ''}
3. A ~30-second intro script for the host to introduce the guest
4. A ~15-second outro script for the host to thank the guest

Format the response as a valid JSON object with these exact keys:
{
  "bio": "professional bio here",
  "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"],
  "intro": "intro script here",
  "outro": "outro script here"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional podcast producer who creates engaging interview briefs. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(content);
      
      // Validate required fields
      if (!parsed.bio || !parsed.questions || !parsed.intro || !parsed.outro) {
        throw new Error('Missing required fields in AI response');
      }
      
      if (!Array.isArray(parsed.questions) || parsed.questions.length !== 5) {
        throw new Error('Questions must be an array of exactly 5 items');
      }
      
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate brief with AI');
  }
}

// POST /api/generate - Generate a new brief
router.post('/', validateGuestData, async (req, res) => {
  try {
    const { name, link, topic, interviewStyle } = req.body;
    
    console.log(`Generating brief for guest: ${name} with style: ${interviewStyle}`);
    
    // Generate brief using OpenAI
    const aiResponse = await generateBriefWithAI({ name, link, topic, interviewStyle });
    
    // Save guest to database
    const guest = await db.createGuest({ name, link, topic, interviewStyle });
    
    // Save brief to database
    const brief = await db.createBrief({
      guestId: guest.id,
      bio: aiResponse.bio,
      questions: aiResponse.questions,
      intro: aiResponse.intro,
      outro: aiResponse.outro
    });
    
    // Return the complete brief
    const completeBrief = {
      id: brief.id,
      guestId: guest.id,
      guestName: guest.name,
      guestLink: guest.link,
      guestTopic: guest.topic,
      interviewStyle: guest.interviewStyle,
      bio: aiResponse.bio,
      questions: aiResponse.questions,
      intro: aiResponse.intro,
      outro: aiResponse.outro,
      createdAt: new Date().toISOString()
    };
    
    console.log(`✅ Brief generated successfully for ${name} (ID: ${brief.id})`);
    
    res.status(201).json({
      success: true,
      message: 'Brief generated successfully',
      brief: completeBrief
    });
    
  } catch (error) {
    console.error('Error generating brief:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate brief'
    });
  }
});

// GET /api/generate - Get all briefs (optional endpoint for listing)
router.get('/', async (req, res) => {
  try {
    const briefs = await db.getAllBriefs();
    
    res.json({
      success: true,
      briefs: briefs
    });
  } catch (error) {
    console.error('Error fetching briefs:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch briefs'
    });
  }
});

// GET /api/generate/:id - Get a specific brief
router.get('/:id', async (req, res) => {
  try {
    const briefId = parseInt(req.params.id);
    
    if (isNaN(briefId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid brief ID'
      });
    }
    
    const brief = await db.getBrief(briefId);
    
    if (!brief) {
      return res.status(404).json({
        success: false,
        error: 'Brief not found'
      });
    }
    
    res.json({
      success: true,
      brief: brief
    });
  } catch (error) {
    console.error('Error fetching brief:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch brief'
    });
  }
});

module.exports = router; 