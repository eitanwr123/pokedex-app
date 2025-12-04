import { User } from "../db/schema";

export type PublicUser = Pick<User, "id" | "email" | "username">;
