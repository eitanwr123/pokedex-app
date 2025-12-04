import { hashPassword, comparePassword, generateToken } from "../lib/passwords";
import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl";
import { RegistrationData } from "../schemas/registration";
import { LoginData } from "../schemas/login";
import { PublicUser } from "../types/user";

export const registerUser = async (
  regData: RegistrationData
): Promise<{ publicUser: PublicUser }> => {
  //check if user exists in database
  const userRepository = new UserRepositoryImpl();
  const userExists = await userRepository.findUserByEmail(regData.email);
  if (userExists) {
    throw new Error("User already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(regData.password);

  // Create user in database
  const userData = await userRepository.createUser(
    regData.email,
    passwordHash,
    regData.username
  );

  return {
    publicUser: {
      id: userData.id,
      email: userData.email,
      username: userData.username,
    },
  };
};

export const loginUser = async (
  credentials: LoginData
): Promise<{ id: number; email: string; username: string; token: string }> => {
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

  //generate JWT payload
  const payload = { id: user.id, email: user.email, username: user.username };

  // Generate JWT token
  const token = generateToken(payload);

  // Return user data (without password hash) and token
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    token: token,
  };
};
