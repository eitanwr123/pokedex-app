//controller for login
import { ZodError } from "zod";
import { loginSchema } from "../../schemas/login";
import { loginUser } from "../../services/authService";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    // 1. Validate input
    const validatedData = loginSchema.parse(req.body);

    // 2. Call service to authenticate
    const result = await loginUser(validatedData);

    // 3. Send success response
    res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues,
      });
    }

    // Handle invalid credentials
    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Handle other errors
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
    });
  }
};
