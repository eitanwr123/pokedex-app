import bcrypt from "bcrypt";
export async function hashPassword(password: string): Promise<string> {
  // implement password hashing logic here use bcrypt

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
