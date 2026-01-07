import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users, User, NewUser } from "../db/schema";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepositoryImpl implements IUserRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }

  async createUser(newUser: NewUser): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        email: newUser.email,
        passwordHash: newUser.passwordHash,
        username: newUser.username,
      })
      .returning();

    return result[0];
  }
}
