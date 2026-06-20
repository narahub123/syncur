import { getNoticesAction } from "../actions/getNoticesAction";
import { UserNoticesQuery } from "../types/search";

export async function getNotices(query: UserNoticesQuery) {
  return await getNoticesAction(query);
}
