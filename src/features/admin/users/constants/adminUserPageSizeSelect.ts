  import { AdminUserPageSize } from "../types";

  export const ADMIN_USER_PAGE_SIZE_OPTIONS: {
    label: string;
    value: AdminUserPageSize;
  }[] = [
    { label: "10개", value: 10 },
    { label: "20개", value: 20 },
    { label: "50개", value: 50 },
    { label: "100개", value: 100 },
  ];
