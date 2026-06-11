import { SortOrder } from "@/shared/types/pagination";

export type AdminUserSearchField = "name" | "email";

export type AdminUserSort =
  | "name"
  | "email"
  | "role"
  | "onboarding"
  | "createdAt";

export type AdminUserPageSize = 10 | 20 | 50 | 100;

export type AdminUsersQuery = {
  search: string;
  searchField: AdminUserSearchField;
  sort: AdminUserSort;
  sortOrder: SortOrder;
  page: number;
  limit: AdminUserPageSize;
};
