import { adminUserFeedInteractionRepository } from "../repositories/AdminUserFeedInteractionRepository.instance";
import { AdminUserFeedInteractionService } from "./AdminUserFeedInteractionService";

export const adminUserFeedInteractionService =
  new AdminUserFeedInteractionService(adminUserFeedInteractionRepository);
