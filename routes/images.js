
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/download-image', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const imageBuffer = await response.buffer();
    

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="generated-artwork-${Date.now()}.png"`,
      'Content-Length': imageBuffer.length
    });
    
    res.send(imageBuffer);
    
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

module.exports = router;