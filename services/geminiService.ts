import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const createChatSession = (systemInstruction: string): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.8, // Slightly higher for more creative roleplay
      maxOutputTokens: 500, // Increased to allow fuller answers
    },
  });
};

export const sendMessageToGeralt = async (
  chatSession: Chat,
  userMessage: string
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: userMessage,
    });
    return response.text || "Хм... (Геральт кивнул, но промолчал)";
  } catch (error) {
    console.error("Geralt is meditating (Error):", error);
    return "Зараза... Медальон дрожит. Похоже, магия глушит связь. (Ошибка соединения)";
  }
};