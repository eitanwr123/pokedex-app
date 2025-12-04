import { ZodError } from "zod";
import { registrationSchema } from "../../schemas/registration";
import { registerUser } from "../../services/authService";
import { Request, Response } from "express";

// src/controllers/auth.controller.ts
export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registrationSchema.parse(req.body);

    const result = await registerUser(validatedData);

    res.status(201).json({
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    if (error instanceof Error && error.message === "User already exists") {
      return res.status(409).json({ message: "User already exists" });
    }

    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};
