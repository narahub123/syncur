import { UserRepository } from "./UserRepository";

/**
 * UserRepository instance
 *
 * service layer에서 주입하여 사용
 */
export const userRepository = new UserRepository();
