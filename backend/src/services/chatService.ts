import { GenerativeModel } from "@google/generative-ai";

export class ChatService {
  private model: GenerativeModel;

  constructor(model: GenerativeModel) {
    this.model = model;
  }

  async chatWithAI(userInput: string): Promise<string> {
    try {
      const systemPrompt = `You are a helpful Pokémon expert assistant.
Answer questions about Pokémon with accurate, concise information.
Keep responses friendly and informative.`;

      const fullPrompt = `${systemPrompt}\n\nUser: ${userInput}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to get response from AI");
    }
  }
}
