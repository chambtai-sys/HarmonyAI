import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MusicTheoryResponse, ImageSize } from "../types";

// Helper to get a fresh client instance. 
// We create a new instance per call to ensure we capture the latest API key if it changes via the selection UI.
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Extracts structured music theory data (notes, scales, chords) from a user prompt.
 * Uses a faster model (Flash) for snappy JSON responses.
 */
export const getMusicTheoryData = async (prompt: string): Promise<MusicTheoryResponse> => {
  const ai = getAiClient();
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The formal name of the scale or chord found." },
      description: { type: Type.STRING, description: "A brief 1-sentence description of the theory behind it." },
      notes: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "The notes in the scale/chord. Format: NoteName + Octave (e.g., C4, F#4, Bb3). Please try to keep notes within the printable range of C3 to C6 mostly, unless the chord specificially requires bass/treble." 
      },
      intervals: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "The intervals relative to the root (e.g., 'Perfect 5th', 'Major 3rd')."
      }
    },
    required: ["name", "description", "notes"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate music theory data for the following request: "${prompt}". If the request is ambiguous, pick the most common interpretation (e.g. "C" -> "C Major Scale" or "C Major Chord").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3, // Low temperature for factual accuracy
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as MusicTheoryResponse;
  } catch (error) {
    console.error("Music Theory API Error:", error);
    throw error;
  }
};

/**
 * Chat with the music assistant.
 * Uses gemini-3-pro-preview for complex reasoning.
 */
export const sendChatMessage = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  const ai = getAiClient();
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "You are a helpful and knowledgeable music theory professor. You explain concepts clearly, from basic scales to advanced jazz harmony. Keep answers concise but informative.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};

/**
 * Generates an image based on a prompt and size.
 * Uses gemini-3-pro-image-preview.
 */
export const generateMusicImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = getAiClient();

  try {
    // Determine aspect ratio or other configs if needed. Defaulting to 1:1 for simplicity unless logic demands otherwise.
    // The model supports 1K, 2K, 4K via imageSize in config.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Gen API Error:", error);
    throw error;
  }
};