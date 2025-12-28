import { Request, Response } from "express";
import { getAllPokemonService } from "../../services/pokemonService";
import { ZodError } from "zod";
import { pokemonQuerySchema } from "../../schemas/filterSchema";

export const getAllPokemon = async (req: Request, res: Response) => {
  try {
    const validatedParams = pokemonQuerySchema.parse(req.query);

    const result = await getAllPokemonService(validatedParams);

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
