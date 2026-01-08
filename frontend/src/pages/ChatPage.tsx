import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../services/chatService";
import { PageLayout } from "../components/PageLayout";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [messageIdCounter, setMessageIdCounter] = useState(0);

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdCounter + 1,
          text: response,
          sender: "ai",
          timestamp: Date.now(),
        },
      ]);
      setMessageIdCounter((prev) => prev + 1);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdCounter + 1,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "ai",
          timestamp: Date.now(),
        },
      ]);
      setMessageIdCounter((prev) => prev + 1);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: messageIdCounter,
      text: inputValue,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageIdCounter((prev) => prev + 1);
    chatMutation.mutate(inputValue);
    setInputValue("");
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        <div className="bg-white rounded-t-lg shadow-md p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Pokemon AI Assistant
          </h1>
          <p className="text-sm text-gray-600">
            Ask me anything about Pokemon!
          </p>
        </div>

        <div className="flex-1 bg-white shadow-md overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">Start a conversation!</p>
                <p className="text-sm">
                  Ask me about Pokemon types, abilities, evolutions, and more.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-200"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="bg-white rounded-b-lg shadow-md p-4 border-t"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={chatMutation.isPending}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || chatMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
