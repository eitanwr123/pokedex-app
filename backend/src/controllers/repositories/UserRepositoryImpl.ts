import { User } from "../../types/user";

export class UserRepositoryImpl {
  //implement function checks if user exist by email
  existsByEmail(email: string): Promise<User | null> {
    return Promise.resolve(null);
  }
}
