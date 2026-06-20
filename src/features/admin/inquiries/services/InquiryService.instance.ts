import { inquiryRepository } from "../repositories/InquiryRepository.instance";
import { InquiryService } from "./InquiryService";

export const inquiryService = new InquiryService(inquiryRepository);
