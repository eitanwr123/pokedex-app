import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { getUserCollectionService } from "../../services/getUserCollectionService";
const getUserCollection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userCollection = await getUserCollectionService(userId);
    return res.status(200).json({ collection: userCollection });
  } catch (error) {
    return error instanceof Error
      ? res.status(400).json({ error: error.message })
      : res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getUserCollection;
