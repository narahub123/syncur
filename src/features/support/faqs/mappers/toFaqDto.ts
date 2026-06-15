import { FaqResponseDTO } from "../dtos";
import { FaqLean } from "../types/lean";

/**
 * Faq 원본 Lean 객체를 직렬화된 FaqResponseDTO로 변환합니다.
 */
export const toFaqDto = (lean: FaqLean): FaqResponseDTO => {
  return {
    _id: lean._id.toString(),
    userId: lean.userId.toString(),
    category: lean.category,
    question: lean.question,
    answer: lean.answer,
    sortOrder: lean.sortOrder,
    isPublished: lean.isPublished,
    createdAt: lean.createdAt.toISOString(),
    updatedAt: lean.updatedAt.toISOString(),
  };
};

export const toFaqDtos = (items: FaqLean[]) => {
  return items.map(toFaqDto);
};
