"use client";

import { useQuery } from "@tanstack/react-query";
import { getBugReportAction } from "../actions/getBugReportAction";

export function useBugReportQuery(bugReportId: string) {
  return useQuery({
    queryKey: ["bugReport", bugReportId],

    queryFn: () => getBugReportAction(bugReportId),

    enabled: !!bugReportId,
  });
}
