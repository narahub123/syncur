import { adminFaqRepository } from "../repositories/AdminFaqRepository.instance";
import { AdminFaqService } from "./AdminFaqService";

export const adminFaqService = new AdminFaqService(adminFaqRepository);
