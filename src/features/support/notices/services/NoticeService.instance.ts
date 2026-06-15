import { noticeRepository } from "../repository/NoticeRepository.instance";
import { NoticeService } from "./NoticeService";

export const noticeService = new NoticeService(noticeRepository);
