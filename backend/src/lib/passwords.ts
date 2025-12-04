import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload, jwtPayloadSchema } from "../schemas/login";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// generate token by getting the cradentials and signing them with jwt
export function generateToken(payload: JwtPayload): string {
  //validate payload with jwtPayloadSchema
  jwtPayloadSchema.parse(payload);
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}
