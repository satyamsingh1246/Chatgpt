const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: content,
    config:{
      temperature:0.9,
      
    }
  });

  return response.text;
}

async function generateVector(content){
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: content,
        config:{
            outputDimensionality: 768,
        }
    });

    return response.embeddings
}

module.exports = { generateResponse , generateVector};
