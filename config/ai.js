const vision = require('@google-cloud/vision');
const OpenAI = require('openai');

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
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
  openrouter,
  visionClient,
  STYLES
};
