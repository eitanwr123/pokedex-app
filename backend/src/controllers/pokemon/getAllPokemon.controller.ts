import { Request, Response } from "express";
import { paginationSchema } from "../../schemas/pagination";
import { getAllPokemonService } from "../../services/pokemonService";
import { ZodError, z } from "zod";

export const getAllPokemon = async (req: Request, res: Response) => {
  try {
    const validatedParams = paginationSchema.parse(req.query);

    const result = await getAllPokemonService(
      validatedParams.page,
      validatedParams.limit
    );

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
