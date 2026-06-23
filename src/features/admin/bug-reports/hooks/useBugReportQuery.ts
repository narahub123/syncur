"use client";

import { useQuery } from "@tanstack/react-query";
import { getBugReportAction } from "../actions/getBugReportAction";
import { bugReportKeys } from "../constants/bugReportKeys";

export function useBugReportQuery(bugReportId: string) {
  return useQuery({
    queryKey: bugReportKeys.detail(bugReportId),

    queryFn: () => getBugReportAction(bugReportId),

    enabled: !!bugReportId,
  });
}
