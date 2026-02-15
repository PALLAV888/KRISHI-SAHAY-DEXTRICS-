
import { GoogleGenAI, Modality, Type } from "@google/genai";

const NO_SPECIAL_CHARS_RULE = "Do not use any special characters like asterisks, hashtags, underscores, bullet points, or markdown formatting. Use only plain text sentences with basic punctuation like periods and commas.";

const LIVE_SYSTEM_INSTRUCTION = `You are KrishiSahay’s real-time agricultural voice assistant, specifically designed for Indian farmers. 
Your goal is to provide expert advice on crops, weather, soil health, and market trends.

CORE LANGUAGE RULES:
- You must respond in the EXACT SAME language or dialect the user uses.
- If the user speaks Hindi, respond in Hindi.
- If the user speaks Marathi, respond in Marathi.
- If the user speaks Punjabi, respond in Punjabi.
- If the user speaks a mix (like Hinglish), mirror that exact style.
- Use simple, rural-appropriate vocabulary. Avoid academic or overly formal language.
- Be concise. Farmers are often busy in the field. Limit responses to 2-3 sentences.

BEHAVIORAL RULES:
- Be empathetic and encouraging.
- ${NO_SPECIAL_CHARS_RULE}
- Do not list things with numbers. Use transition words like 'also' or 'next' instead.
- Speak naturally as if you are standing next to the farmer in their field.`;

export const connectLiveAssistant = (callbacks: any) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }, // Using Puck for a warm, clear tone
      },
      systemInstruction: LIVE_SYSTEM_INSTRUCTION,
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
  });
};

export const getAgriAdvice = async (question: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API Key not configured.");
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: `You are an agricultural advisor. ${NO_SPECIAL_CHARS_RULE}`,
        temperature: 0.7,
      }
    });
    return response.text || "I am sorry, I could not generate an answer.";
  } catch (error) {
    return "The assistant is currently resting. Please try again.";
  }
};

export const getLiveMarketInsights = async (crop: string, state: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API Key not configured.");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `What are the latest mandi prices for ${crop} in ${state} from eNAM? ${NO_SPECIAL_CHARS_RULE}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) { throw error; }
};

export const getLiveSchemes = async (crop: string, state: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API Key not configured.");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Find latest govt schemes from data.gov.in for ${crop} in ${state}. ${NO_SPECIAL_CHARS_RULE}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) { throw error; }
};

export const getVoiceAgriAdvice = async (question: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API Key not configured.");
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: `Speak naturally in the farmer's language. ${NO_SPECIAL_CHARS_RULE}`,
        temperature: 0.5,
      }
    });
    return response.text || "I am sorry.";
  } catch (error) { return "Error."; }
};

export const detectDisease = async (base64Image: string, mimeType: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API Key not configured.");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Agricultural disease expert. ${NO_SPECIAL_CHARS_RULE}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ inlineData: { data: base64Image, mimeType } }, { text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: { type: Type.STRING },
            severity: { type: Type.STRING },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER }
          },
          required: ["diseaseName", "severity", "treatment", "prevention", "confidence"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { throw error; }
};

export const getFertilizerAdvice = async (crop: string, soilType: string, growthStage: string, npk: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API Key not configured.");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Agronomist evaluation for ${crop}, ${soilType}, ${growthStage}, ${npk}. ${NO_SPECIAL_CHARS_RULE}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.5 }
    });
    return response.text;
  } catch (error) { return "Unable to generate explanation."; }
};

export const getMachineryCostAdvice = async (type: string, acres: number, duration: string, cost: number) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API Key not configured.");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Economy advisor for ${type}, ${acres} acres, ${duration}, cost ${cost}. ${NO_SPECIAL_CHARS_RULE}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.5 }
    });
    return response.text;
  } catch (error) { return "Unable to calculate recommendation."; }
};
