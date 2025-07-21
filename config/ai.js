const vision = require('@google-cloud/vision');
const Together = require('together-ai');

const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });
const visionClient = new vision.ImageAnnotatorClient({ 
  keyFilename: 'artloop-466212-6e252fad9d85.json' 
});

const STYLES = {
  realistic: 'photorealistic, high quality, detailed, 8k resolution',
  anime: 'anime style, manga art, detailed anime illustration',
  cartoon: 'cartoon style, animated, colorful illustration',
  oil_paint: 'oil painting style, traditional art, painterly',
  sketch: 'pencil sketch, hand drawn, artistic sketch',
  cyberpunk: 'cyberpunk style, neon lights, futuristic, sci-fi'
};

module.exports = {
  together,
  visionClient,
  STYLES
};