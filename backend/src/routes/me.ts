import Router from "express";
import { authMiddleware } from "../middleware/auth";
import getUserCollection from "../controllers/pokemon/getUserCollection.controller";
import { catchReleasePokemonController } from "../controllers/pokemon/catchReleasePokemon.controller";

const router = Router();

// GET /api/me/collection - Get user's Pokemon collection
router.get("/collection", authMiddleware, getUserCollection);

// POST /me/collection/:pokemonId/toggle — catch/release a Pokémon.
router.post(
  "/collection/:pokemonId/toggle",
  authMiddleware,
  catchReleasePokemonController
);

export default router;
