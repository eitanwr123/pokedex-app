import { z } from "zod";
import { AuthRequest } from "../../middleware/auth";
import { Response } from "express";
import { catchReleasePokemonParamSchema } from "../../schemas/params";
import { catchReleasePokemonService } from "../../services/catchReleasePokemonService";

export const catchReleasePokemonController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const pokemonIdSchema = catchReleasePokemonParamSchema.parse(req.params);
    const { pokemonId } = pokemonIdSchema;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await catchReleasePokemonService(userId, pokemonId);
    if (!result) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }
    res.status(200).json({ message: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
