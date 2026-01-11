import { Request, Response } from "express";
import { ZodError } from "zod";
import { appContainer } from "../../container";
import { chatAiSchema } from "../../schemas/chatAiSchemas";
import { AuthRequest } from "../../middleware/auth";

export const chatAi = async (req: AuthRequest, res: Response) => {
  try {
    //validate req contains message field
    const validatedData = chatAiSchema.parse(req.body);

    const chatService = appContainer.getChatService();

    const aiResponse = await chatService.chatWithAI(validatedData.message);

    res.status(200).json({
      message: "AI response received",
      data: aiResponse,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    console.error("Chat AI error:", error);
    res.status(500).json({
      error: "InternalServerError",
      message: "Failed to get AI response",
    });
  }
};
