import { ZodError } from "zod";
import { registrationSchema } from "../../schemas/registration";
import { registerUser } from "../../services/authService";
import { Request, Response } from "express";

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
      return res.status(400).json({
        error: "ValidationError",
        message: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    if (error instanceof Error && error.message === "User already exists") {
      return res.status(409).json({
        error: "UserAlreadyExists",
        message: "User already exists",
      });
    }

    console.error("Registration error:", error);
    res.status(500).json({
      error: "InternalServerError",
      message: "Registration failed",
    });
  }
};
