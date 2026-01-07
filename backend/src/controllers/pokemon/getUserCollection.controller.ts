import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { ZodError } from "zod";
import { pokemonQuerySchema } from "../../schemas/filterSchema";
import { appContainer } from "../../container";

export const getUserCollection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        error: "Unauthorized",
        message: "User authentication required",
      });
      return;
    }

    const validatedParams = pokemonQuerySchema.parse(req.query);

    const userPokemonService = appContainer.getUserPokemonService();
    const result = await userPokemonService.getUserCollection({
      ...validatedParams,
      userId,
    });

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "ValidationError",
        message: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    res.status(500).json({
      error: "InternalServerError",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
