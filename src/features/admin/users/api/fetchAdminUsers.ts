import { getAdminUsersPaginatedAction } from "../actions/getAdminUsersPaginatedAction";
import { AdminUsersQuery } from "../types";

export const fetchAdminUsers = async (query: AdminUsersQuery) => {
  return await getAdminUsersPaginatedAction(query);
};
