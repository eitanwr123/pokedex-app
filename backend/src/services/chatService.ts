import { GenerativeModel } from "@google/generative-ai";

export class ChatService {
  private model: GenerativeModel;

  constructor(model: GenerativeModel) {
    this.model = model;
  }

  /**
   * Send a message to Gemini and get a response
   * @param userInput - User's question/message
   * @returns AI response text
   */
  async chatWithAI(userInput: string): Promise<string> {
    try {
      // System prompt to make it a Pokémon expert
      const systemPrompt = `You are a helpful Pokémon expert assistant.
Answer questions about Pokémon with accurate, concise information.
Keep responses friendly and informative.`;

      // Combine system prompt with user message
      const fullPrompt = `${systemPrompt}\n\nUser: ${userInput}`;

      // Call Gemini API
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
