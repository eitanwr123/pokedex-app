import { comparePassword, generateToken, hashPassword } from "../lib/passwords";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { LoginData } from "../schemas/login";
import { RegistrationData } from "../schemas/registration";
import { PublicUser } from "../types/user";

export class AuthService {
  constructor(private _userRepository: IUserRepository) {}
  async registerUser(
    regData: RegistrationData
  ): Promise<{ publicUser: PublicUser }> {
    //check if user exists in database
    const userExists = await this._userRepository.findUserByEmail(
      regData.email
    );
    if (userExists) {
      throw new Error("User already exists");
    }

    // Hash password
    const passwordHash = await hashPassword(regData.password);

    // Create user in database
    const newUser = {
      email: regData.email,
      passwordHash,
      username: regData.username,
    };
    const userData = await this._userRepository.createUser(newUser);

    return {
      publicUser: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
      },
    };
  }

  async loginUser(
    credentials: LoginData
  ): Promise<{ id: number; email: string; username: string; token: string }> {
    // Find user by email
    const user = await this._userRepository.findUserByEmail(credentials.email);
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

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      token,
    };
  }
}
