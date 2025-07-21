const { visionClient } = require('../config/ai');

async function analyzeImage(base64ImageData) {
  console.log('Performing analysis...');
  const imageBuffer = Buffer.from(base64ImageData.split(',')[1], 'base64');
  const request = {
    image: { content: imageBuffer },
    features: [
      { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
      { type: 'TEXT_DETECTION' },
      { type: 'IMAGE_PROPERTIES' },
      { type: 'WEB_DETECTION', maxResults: 10 },
      { type: 'LABEL_DETECTION', maxResults: 10 }
    ],
  };
  
  try {
    const [result] = await visionClient.annotateImage(request);

    const detailed_analysis = {
      colors: result.imagePropertiesAnnotation?.dominantColors?.colors?.slice(0, 5) || [],
      objects: result.localizedObjectAnnotations?.map(obj => ({
        name: obj.name.toLowerCase(),
        score: obj.score,
        normalizedVertices: obj.boundingPoly.normalizedVertices,
      })) || [],
      text: result.fullTextAnnotation?.text?.trim().replace(/\s+/g, ' ') || null,
      web_entities: result.webDetection?.webEntities?.map(e => e.description) || [],
      labels: result.labelAnnotations?.map(l => l.description.toLowerCase()) || [],
    };

    console.log('Analysis Complete:', detailed_analysis);
    return { detailed_analysis };

  } catch (error) {
    console.error('Error during analysis:', error);
    return { detailed_analysis: { error: 'Analysis failed' } };
  }
}

function combineResults(analysis) {
  if (!analysis || analysis.error) return "a hand-drawn sketch";
  const parts = new Set();
  
  if (analysis.web_entities?.length > 0) {
    parts.add(analysis.web_entities.join(', '));
  }
  
  if (analysis.objects?.length > 0) {
    analysis.objects.forEach(obj => { 
      if (!analysis.web_entities?.some(we => we.toLowerCase().includes(obj.name))) 
        parts.add(obj.name); 
    });
  }
  
  if (analysis.text) {
    parts.add(`text that says "${analysis.text}"`);
  }
  
  if (analysis.colors?.length > 0) {
    const colorDescriptions = analysis.colors.map(c => `rgb(${c.color.red}, ${c.color.green}, ${c.color.blue})`);
    parts.add(`with a color palette focusing on ${colorDescriptions.join(', ')}`);
  }
  
  if (parts.size === 0 && analysis.labels?.length > 0) {
    const filteredLabels = analysis.labels.filter(l => 
      !['illustration', 'drawing', 'art', 'sketch'].includes(l)
    );
    if (filteredLabels.length > 0) {
      parts.add(filteredLabels.slice(0, 3).join(', '));
    }
  }
  
  if (parts.size === 0) return "a hand-drawn sketch";
  return Array.from(parts).join(', ');
}

module.exports = {
  analyzeImage,
  combineResults
};