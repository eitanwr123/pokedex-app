import { Router } from "express";
import { z } from "zod";

const router = Router();

// POST /api/auth - Register a new user
router.post("/register", (req, res) => {
  res.json({
    message: "Register a new user",
    data: req.body,
  });
});

export default router;
