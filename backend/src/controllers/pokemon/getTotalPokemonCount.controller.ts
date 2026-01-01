import { AuthRequest } from "../../middleware/auth";
import { getTotalPokemonCountService } from "../../services/getTotalPokemonCountService";

export const getTotalPokemonCount = async (req: AuthRequest, res: any) => {
  try {
    const totalCount = await getTotalPokemonCountService();
    res.status(200).json({ total: totalCount });
  } catch (error) {
    res.status(500).json({
      error: "InternalServerError",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
