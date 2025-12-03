import { z } from "zod";

export const registrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().min(5, "Email must be at least 5 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type RegistrationData = z.infer<typeof registrationSchema>;
