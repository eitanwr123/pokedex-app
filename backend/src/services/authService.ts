import { hashPassword, comparePassword } from "../lib/passwords";
import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl";
import { RegistrationData } from "../schemas/registration";
import { LoginData } from "../schemas/login";

export const registerUser = async (
  userData: RegistrationData
): Promise<{ email: string; username: string }> => {
  //check if user exists in database
  const userRepository = new UserRepositoryImpl();
  const userExists = await userRepository.findUserByEmail(userData.email);
  if (userExists) {
    throw new Error("User already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(userData.password);

  // Create user in database
  await userRepository.createUser(
    userData.email,
    passwordHash,
    userData.username
  );

  return { email: userData.email, username: userData.username };
};

export const loginUser = async (
  credentials: LoginData
): Promise<{ id: number; email: string; username: string }> => {
  const userRepository = new UserRepositoryImpl();

  // Find user by email
  const user = await userRepository.findUserByEmail(credentials.email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare password with stored hash
  const isPasswordValid = await comparePassword(
    credentials.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Return user data (without password hash)
  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
};
