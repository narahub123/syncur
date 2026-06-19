import { adminNoticeRepository } from "../repositories/AdminNoticeRepository.instance";
import { AdminNoticeService } from "./AdminNoticeService";

export const adminNoticeService = new AdminNoticeService(adminNoticeRepository);
