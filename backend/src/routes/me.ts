import Router from "express";
import { authMiddleware } from "../middleware/auth";
import getUserCollection from "../controllers/pokemon/getUserCollection.controller";

const router = Router();

// GET /api/me/collection - Get user's Pokemon collection
router.get("/collection", authMiddleware, getUserCollection);

export default router;
