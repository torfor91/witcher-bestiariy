import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    // Проверяем оба варианта имени переменной
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || 
                  import.meta.env?.GEMINI_API_KEY ||
                  process.env.VITE_GEMINI_API_KEY || 
                  process.env.GEMINI_API_KEY;
    
    console.log('API Key available:', !!apiKey);
    
    if (!apiKey) {
      console.error('❌ Gemini API key is missing!');
      console.error('Please add VITE_GEMINI_API_KEY to your .env.local file');
      // Возвращаем заглушку вместо падения
      // В продакшене лучше бы падать, но для разработки оставим
      return new GoogleGenAI({ apiKey: 'dummy-key' });
    }
    
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const createChatSession = (systemInstruction: string): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-2.0-flash-exp', // используем бесплатную модель
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.8,
      maxOutputTokens: 500,
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
  } catch (error: any) {
    console.error("Geralt is meditating (Error):", error);
    
    // Проверяем специфические ошибки API
    if (error?.message?.includes('API_KEY')) {
      return "Проклятье! Ключ от портала потерян. Проверь, правильно ли настроен API ключ.";
    }
    
    return "Зараза... Медальон дрожит. Похоже, магия глушит связь. (Ошибка соединения)";
  }
};