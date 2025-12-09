import { AuthRequest } from "../../middleware/auth";
import { Response } from "express";
import { idParamSchema } from "../../schemas/params";
import { getPokemonByIdService } from "../../services/getPokemonByIdService";

export const getPokemonById = async (req: AuthRequest, res: Response) => {
  try {
    const validatedParams = idParamSchema.parse(req.params);
    const pokemonId = validatedParams.id;
    const pokemon = await getPokemonByIdService(pokemonId);
    return res.status(200).json({ pokemon });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Invalid ID parameter", details: error.message });
    }
    return error instanceof Error
      ? res.status(400).json({ error: error.message })
      : res.status(500).json({ error: "Internal Server Error" });
  }
};
