import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "./UserService";

/**
 * UserService instance
 *
 * repository 주입 방식으로 생성
 */
export const userService = new UserService(new UserRepository());
