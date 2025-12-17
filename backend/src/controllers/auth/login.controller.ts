//controller for login
import { ZodError } from "zod";
import { loginSchema } from "../../schemas/login";
import { loginUser } from "../../services/authService";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    res.status(200).json({
      message: "Login successful",
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

    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({
        error: "InvalidCredentials",
        message: "Invalid email or password",
      });
    }

    console.error("Login error:", error);
    res.status(500).json({
      error: "InternalServerError",
      message: "Login failed",
    });
  }
};
