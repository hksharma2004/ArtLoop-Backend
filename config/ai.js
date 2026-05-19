const vision = require('@google-cloud/vision');

const visionClient = new vision.ImageAnnotatorClient({ 
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'artloop-466212-6e252fad9d85.json' 
});

const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';

const STYLES = {
  realistic: 'photorealistic, high quality, detailed, 8k resolution',
  anime: 'anime style, manga art, detailed anime illustration',
  cartoon: 'cartoon style, animated, colorful illustration',
  oil_paint: 'oil painting style, traditional art, painterly',
  sketch: 'pencil sketch, hand drawn, artistic sketch',
  cyberpunk: 'cyberpunk style, neon lights, futuristic, sci-fi'
};

module.exports = {
  visionClient,
  GEMINI_API_BASE_URL,
  GEMINI_IMAGE_MODEL,
  STYLES
};
