import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users, User } from "../db/schema";

export class UserRepositoryImpl {
  //implement function checks if user exist by email
  async findUserByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }

  async createUser(
    email: string,
    passwordHash: string,
    username: string
  ): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        email: email,
        passwordHash: passwordHash,
        username: username,
      })
      .returning();

    return result[0];
  }
}
