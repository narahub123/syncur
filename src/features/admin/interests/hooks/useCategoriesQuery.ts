"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoriesAction } from "../actions/getCategoriesAction";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });
}
