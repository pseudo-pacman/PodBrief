const express = require('express');
const { db } = require('../database/init');

const router = express.Router();

// GET /api/briefs - Get all briefs in descending order by date
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

// GET /api/briefs/:id - Get a specific brief by ID
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

// DELETE /api/briefs/:id - Delete a brief
router.delete('/:id', async (req, res) => {
  try {
    const briefId = parseInt(req.params.id);
    
    if (isNaN(briefId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid brief ID'
      });
    }
    
    // First check if brief exists
    const brief = await db.getBrief(briefId);
    
    if (!brief) {
      return res.status(404).json({
        success: false,
        error: 'Brief not found'
      });
    }
    
    // Delete the brief (this will cascade to delete the guest if no other briefs reference them)
    await db.deleteBrief(briefId);
    
    res.json({
      success: true,
      message: 'Brief deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting brief:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete brief'
    });
  }
});

module.exports = router; 