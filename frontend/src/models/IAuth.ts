import type { User } from "./IUser";

export interface AuthState {
  token: string | null
  user: Pick<User, 'id' | 'name' | 'email'> | null
}
