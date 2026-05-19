const { GEMINI_API_BASE_URL, GEMINI_IMAGE_MODEL } = require('../config/ai');

function getGeminiApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  return process.env.GEMINI_API_KEY;
}

async function generateFinalImage(finalPrompt) {
  console.log(`Generating final image with ${GEMINI_IMAGE_MODEL}...`);
  
  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${GEMINI_IMAGE_MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': getGeminiApiKey(),
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: finalPrompt }],
          },
        ],
        generationConfig: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data.error?.message || `Gemini API returned ${response.status}`;
      throw new Error(message);
    }

    const imagePart = data.candidates?.[0]?.content?.parts?.find(part => part.inlineData || part.inline_data);
    const inlineData = imagePart?.inlineData || imagePart?.inline_data;

    if (inlineData?.data) {
      const mimeType = inlineData.mimeType || inlineData.mime_type || 'image/png';
      console.log('Gemini image data received.');
      return `data:${mimeType};base64,${inlineData.data}`;
    }
    
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('Your prompt was blocked by the safety filter.');
    }
    
    throw new Error(data.candidates?.[0]?.finishReason
      ? `The AI model did not return an image. Finish reason: ${data.candidates[0].finishReason}.`
      : 'The AI model failed to generate an image.');
  } catch (error) {
    if (
      error.message.includes('GEMINI_API_KEY') ||
      error.message.includes('safety filter') ||
      error.message.includes('failed to generate') ||
      error.message.includes('did not return an image')
    ) {
      throw error;
    }
    
    console.error('Error during API call:', error);
    throw new Error('The image generation service is currently unavailable.');
  }
}

module.exports = {
  generateFinalImage
};
