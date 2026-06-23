import { createInfiniteQuery } from "@/features/admin/hooks/createInfiniteQuery";
import { BugReportQuery } from "../types/search";
import { AdminBugReportResponseDTO } from "../dto/bugReportDto";
import { fetchBugReports } from "../api/fetchBugReports";
import { BugReportStatsDTO } from "@/features/support/bug-reports/dto/bugReportStatsDTO";

export const useAdminBugReportsInfiniteQuery = createInfiniteQuery<
  BugReportQuery,
  AdminBugReportResponseDTO,
  BugReportStatsDTO
>("bugReports", fetchBugReports);
