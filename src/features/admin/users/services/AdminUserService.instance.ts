import { adminUserRepository } from "../repositories/AdminUserRepository.instance";
import { AdminUserService } from "./AdminUserService";

export const adminUserService = new AdminUserService(adminUserRepository);
