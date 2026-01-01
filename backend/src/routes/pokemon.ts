import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getAllPokemon } from "../controllers/pokemon/getAllPokemon.controller";
import { getPokemonById } from "../controllers/pokemon/getPokemonById.controller";
import { getAllTypes } from "../controllers/pokemon/getAllTtypes.controller";
import { getTotalPokemonCount } from "../controllers/pokemon/getTotalPokemonCount.controller";

const router = Router();

// GET /api/pokemon - Get all Pokemon
router.get("/", authMiddleware, getAllPokemon);

//get pokemon types
router.get("/types", authMiddleware, getAllTypes);

//get total pokemon count
router.get("/count", authMiddleware, getTotalPokemonCount);

// GET /api/pokemon/:id - Get Pokemon by ID
router.get("/:id", authMiddleware, getPokemonById);

export default router;
