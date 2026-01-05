import { NewUser, User } from "../../db/schema";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(newUser: NewUser): Promise<User>;
}
