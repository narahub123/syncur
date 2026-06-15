import { faqRepository } from "../repository/FaqRepository.instance";
import { FaqService } from "./FaqService";

export const faqService = new FaqService(faqRepository);
