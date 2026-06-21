"use client";

import { useQuery } from "@tanstack/react-query";
import { getInterestsAction } from "../actions/getInterestsAction";

export function useInterestsQuery(filter?: {
  categoryId?: string;
  keyword?: string;
}) {
  return useQuery({
    // filter가 변경될 때마다 쿼리가 다시 실행되도록 queryKey에 포함
    queryKey: ["interests", filter],
    queryFn: () => getInterestsAction(filter),
  });
}
