import { BugReportQuery } from "../types/search";

export const bugReportKeys = {
  all: ["bugReports"] as const,

  list: (query: BugReportQuery) =>
    [...bugReportKeys.all, "list", query] as const,

  detail: (id: string) => [...bugReportKeys.all, "detail", id] as const,
};
