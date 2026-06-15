import { createFaqAction } from "../actions/createFaqAction";
import { CreateFaqDto } from "../dtos";

/**
 * FAQ 생성 API
 */
export const createFaq = async (dto: CreateFaqDto) => {
  return await createFaqAction(dto);
};
