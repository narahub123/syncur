"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserInterestsAction } from "../actions/deleteUserInterestsAction";

export function useDeleteUserInterestsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserInterestsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-interests", "tree"] });
    },
  });
}
