import { ZodError } from "zod";
import { registrationSchema } from "../schemas/registration";
import { registerUser } from "../services/authService";
import { Request, Response } from "express";

// src/controllers/auth.controller.ts
export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate input
    const validatedData = registrationSchema.parse(req.body);

    // 2. Call service
    const result = await registerUser(validatedData);

    // 3. Format response
    res.status(201).json({
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    // 4. Handle errors
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.message });
    }
    res.status(500).json({ message: "Registration failed" });
  }
};
