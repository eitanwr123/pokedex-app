import { appContainer } from "../../container";
import { AuthRequest } from "../../middleware/auth";

export const getAllTypes = async (req: AuthRequest, res: any) => {
  try {
    const PokemonService = appContainer.getPokemonService();
    const result = await PokemonService.getAllTypes();
    res.status(200).json({ types: result });
  } catch (error) {
    res.status(500).json({
      error: "InternalServerError",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
