import { Router } from "express";

const router = Router();

// GET /api/pokemon - Get all Pokemon
router.get("/", (req, res) => {
  res.json({
    message: "Get all Pokemon",
    data: [], // This will be populated later
  });
});

// GET /api/pokemon/:id - Get Pokemon by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Get Pokemon with ID: ${id}`,
    data: null, // This will be populated later
  });
});

// POST /api/pokemon - Create new Pokemon
router.post("/", (req, res) => {
  res.json({
    message: "Create new Pokemon",
    data: req.body,
  });
});

// PUT /api/pokemon/:id - Update Pokemon
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Update Pokemon with ID: ${id}`,
    data: req.body,
  });
});

// DELETE /api/pokemon/:id - Delete Pokemon
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Delete Pokemon with ID: ${id}`,
  });
});

export default router;
