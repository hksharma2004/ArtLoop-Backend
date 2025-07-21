const { together } = require('../config/ai');

async function generateFinalImage(finalPrompt) {
  console.log('Generating final image...');
  
  try {
    const response = await together.images.create({ 
      model: "black-forest-labs/FLUX.1-schnell-Free", 
      prompt: finalPrompt, 
      n: 1, 
      steps: 4 
    });
    
    const imageUrl = response.data?.[0]?.url;
    
    if (imageUrl) {
      console.log(' Together AI image URL received.');
      return imageUrl;
    }
    
    if (response.data?.[0]?.finish_reason === 'CONTENT_FILTERED') {
      throw new Error('Your prompt was blocked by the safety filter.');
    }
    
    throw new Error('The AI model failed to generate an image.');
  } catch (error) {
    if (error.message.includes('safety filter') || error.message.includes('failed to generate')) {
      throw error;
    }
    
    console.error('Error during API call:', error);
    throw new Error('The image generation service is currently unavailable.');
  }
}

module.exports = {
  generateFinalImage
};