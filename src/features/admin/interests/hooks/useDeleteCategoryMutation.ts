import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryAction } from "../actions/deleteCategoryAction";

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryAction,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
    },
  });
}
