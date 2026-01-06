import { appContainer } from "../../container";
import { AuthRequest } from "../../middleware/auth";

export const getTotalPokemonCount = async (req: AuthRequest, res: any) => {
  try {
    const PokemonService = appContainer.getPokemonService();
    const totalCount = await PokemonService.getTotalPokemonCount();
    res.status(200).json({ total: totalCount });
  } catch (error) {
    res.status(500).json({
      error: "InternalServerError",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
