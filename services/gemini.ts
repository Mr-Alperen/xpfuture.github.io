
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askClippyStream = async (prompt: string, history: {role: 'user' | 'model', parts: {text: string}[]}[] = []) => {
  const ai = getAI();
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: "Sen 'XPFuture Clippy'sin, Windows XP estetiğine sahip fütüristik bir yapay zeka asistanısın. ChatGPT kadar zeki, nazik ve bilgilisin. 2001 yılının nostaljisini 2050 yılının teknolojisiyle birleştiriyorsun. Kullanıcıya 'Efendim' veya 'Kullanıcı' diye hitap edebilirsin. Teknik konularda çok yetkinsin.",
      temperature: 0.8,
      topP: 0.95,
    },
  });
  return responseStream;
};

export const generateNeuralArt = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A futuristic concept art of ${prompt} in high resolution, vaporwave or cybercore style.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const getFutureNews = async () => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Generate 3 short, exciting 'future news' headlines from the year 2050. Each headline should be under 10 words. Return them as a bulleted list.",
    config: {
      systemInstruction: "You are a news anchor from the year 2050. Focus on space, AI, and fusion energy.",
    },
  });
  return response.text;
};
