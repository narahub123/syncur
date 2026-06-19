import { getAdminNoticesAction } from "../actions/getAdminNoticesAction";
import { AdminNoticeQuery } from "../types/search";

export async function getAdminNotices(query: AdminNoticeQuery) {
  return await getAdminNoticesAction(query);
}
