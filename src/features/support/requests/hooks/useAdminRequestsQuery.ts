"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminRequestQuery } from "../types/admin-search";
import { requestKeys } from "../constants/requestKeys";
import { getRequestsAction } from "../actions/getRequestsAction";

export function useAdminRequestsQuery(query: AdminRequestQuery) {
  return useQuery({
    queryKey: requestKeys.adminList(query),
    queryFn: () => getRequestsAction(query),
    placeholderData: (previousData) => previousData,
  });
}
