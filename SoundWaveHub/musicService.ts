import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function fetchSongDetails(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search for the song info: "${query}".`,
      config: {
        systemInstruction: "You are a professional music librarian. Provide accurate song details, lyrics, and metadata. Most importantly, provide the correct 11-character YouTube Video ID for the official music video if you are confident, otherwise return a placeholder.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            lyrics: { type: Type.STRING, description: "Full lyrics formatted with newlines" },
            youtubeId: { type: Type.STRING, description: "The 11-character YouTube video ID (e.g. dQw4w9WgXcQ)" },
            summary: { type: Type.STRING }
          },
          required: ["title", "artist", "lyrics", "youtubeId"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Error fetching song details:", error);
    return null;
  }
}
