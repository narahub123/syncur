import { getAdminUsersPaginatedAction } from "../actions/getAdminUsersPaginatedAction";

export const fetchAdminUsers = async (params: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  return await getAdminUsersPaginatedAction(params);
};
