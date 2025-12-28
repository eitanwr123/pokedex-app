import { AuthRequest } from "../../middleware/auth";
import { getAllTypesService } from "../../services/getAllTypesService";

export const getAllTypes = async (req: AuthRequest, res: any) => {
  try {
    const result = await getAllTypesService();
    res.status(200).json({ types: result });
  } catch (error) {
    res.status(500).json({
      error: "InternalServerError",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
