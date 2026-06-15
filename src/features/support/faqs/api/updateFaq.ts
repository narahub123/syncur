import { updateFaqAction } from "../actions/updateFaqAction";
import { UpdateFaqDto } from "../dtos";

export const updateFaq = async (id: string, dto: UpdateFaqDto) => {
  return await updateFaqAction(id, dto);
};
