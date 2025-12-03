import { Router } from "express";

const router = Router();

// Health check route
router.get("/", (req, res) => {
  res.json({
    message: "Pokédex API is running!",
    version: "1.0.0",
    status: "healthy",
  });
});

export default router;
