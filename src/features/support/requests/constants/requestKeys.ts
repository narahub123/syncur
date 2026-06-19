
import { AdminRequestQuery } from "../types/admin-search";
import { UserRequestQuery } from "../types/user-search";

export const requestKeys = {
  all: ["requests"] as const,

  // 사용자용
  userList: (query: UserRequestQuery) =>
    [...requestKeys.all, "user", "list", query] as const,
  userDetail: (id: string) =>
    [...requestKeys.all, "user", "detail", id] as const,

  // 관리자용
  adminList: (query: AdminRequestQuery) =>
    [...requestKeys.all, "admin", "list", query] as const,
  adminDetail: (id: string) =>
    [...requestKeys.all, "admin", "detail", id] as const,
};
