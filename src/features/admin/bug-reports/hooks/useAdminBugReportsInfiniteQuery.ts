import { createInfiniteQuery } from "@/features/admin/hooks/createInfiniteQuery";
import { BugReportQuery } from "../types/search";
import { AdminBugReportResponseDTO } from "../dto/bugReportDto";
import { fetchBugReports } from "../api/fetchBugReports";

export const useAdminBugReportsInfiniteQuery = createInfiniteQuery<
  BugReportQuery,
  AdminBugReportResponseDTO,
  unknown
>("bug-reports-infinite", fetchBugReports);
