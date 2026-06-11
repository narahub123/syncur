export type AdminUserSearchField = "name" | "email";
export type AdminUserSort = "latest" | "oldest" | "name";
export type AdminUserPageSize = 10 | 20 | 50 | 100;

export type AdminUsersQuery = {
  search: string;
  searchField: AdminUserSearchField;
  sort: AdminUserSort;
  page: number;
  limit: AdminUserPageSize;
};
