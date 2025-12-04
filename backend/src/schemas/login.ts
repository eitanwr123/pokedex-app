import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(5, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const jwtPayloadSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
});
export type LoginData = z.infer<typeof loginSchema>;
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
