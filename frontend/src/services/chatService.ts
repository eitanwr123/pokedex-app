import { apiClient } from "./api";

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  message: string;
  data: string;
}

export async function sendChatMessage(message: string): Promise<string> {
  const response = await apiClient.post<ChatResponse>("/api/pokemon/chat", {
    message,
  });
  return response.data.data;
}