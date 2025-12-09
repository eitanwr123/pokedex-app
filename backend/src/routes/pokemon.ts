import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getAllPokemon } from "../controllers/pokemon/getAllPokemon.controller";
import { getPokemonById } from "../controllers/pokemon/getPokemonById.controller";

const router = Router();

// GET /api/pokemon - Get all Pokemon
router.get("/", authMiddleware, getAllPokemon);

// GET /api/pokemon/:id - Get Pokemon by ID
router.get("/:id", authMiddleware, getPokemonById);

// POST /api/pokemon - Create new Pokemon
// router.post("/", authMiddleware, createPokemon);

// PUT /api/pokemon/:id - Update Pokemon
// router.put("/:id", authMiddleware, updatePokemon);

// DELETE /api/pokemon/:id - Delete Pokemon
// router.delete("/:id", authMiddleware, deletePokemon);

export default router;
