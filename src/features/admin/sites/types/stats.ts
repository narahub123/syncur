import { PaginatedResponse } from "@/shared/types/pagination";

export type DashboardResponse<T, S> = PaginatedResponse<T> & {
  stats: S;
};
