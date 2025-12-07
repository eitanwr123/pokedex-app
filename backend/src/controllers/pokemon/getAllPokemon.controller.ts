import { Request, Response } from "express";
export const getAllPokemon = async (req: Request, res: Response) => {
  // Implementation to get all Pokemon
  res.json({ message: "All Pokemon data" });
};
