import { AdminUserSort } from "../types";

export const ADMIN_USER_SORT_OPTIONS: {
  label: string;
  value: AdminUserSort;
}[] = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
  { label: "이름순", value: "name" },
];
