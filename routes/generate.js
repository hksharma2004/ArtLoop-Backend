const express = require('express');
const { protect } = require('../middlewares/auth');
const { databases, DATABASE_ID, USERS_COLLECTION_ID } = require('../config/database');
const { STYLES } = require('../config/ai');
const { analyzeImage, combineResults } = require('../services/visionService');
const {  generateFinalImage } = require('../services/imageService');

const router = express.Router();

const checkCredits = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
  if (req.user.credits <= 0) return res.status(429).json({ error: 'No credits remaining', details: 'You have used all of your generation credits.' });
  next();
};

router.post('/', protect, checkCredits, async (req, res) => {
  try {
    const { sketch_data, prompt, style_preset = 'realistic' } = req.body;
    if (!sketch_data || !prompt) return res.status(400).json({ error: 'sketch_data and prompt are required' });

    const { detailed_analysis } = await analyzeImage(sketch_data);
    if (detailed_analysis && detailed_analysis.error) throw new Error('Image analysis failed on the backend.');
    
    const combinedDescription = combineResults(detailed_analysis);
    const styleText = STYLES[style_preset.toLowerCase()] || STYLES.realistic;
    const finalPrompt = `${prompt}, visually inspired by a sketch of ${combinedDescription}. The final image should be in a ${styleText} style.`;
    
    const imageUrl = await generateFinalImage(finalPrompt);
    
    await databases.updateDocument(
      DATABASE_ID, USERS_COLLECTION_ID, req.user.$id, { credits: req.user.credits - 1 }
    );

    res.json({
      success: true, image: imageUrl, prompt_used: finalPrompt,
      analysis_results: detailed_analysis, remainingGenerations: req.user.credits - 1,
    });
  } catch (error) {
    console.error(`Error in generation pipeline: ${error.message}`);
    res.status(500).json({ error: 'Image generation failed', details: error.message });
  }
});

module.exports = router;