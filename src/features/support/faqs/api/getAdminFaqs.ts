import { getAdminFaqsAction } from "../actions/getAdminFaqsAction";
import { AdminFaqsQuery } from "../types/search";

export const getAdminFaqs = async (query: AdminFaqsQuery) => {
  return await getAdminFaqsAction(query);
};
