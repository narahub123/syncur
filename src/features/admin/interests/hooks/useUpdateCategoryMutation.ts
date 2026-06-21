import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryAction } from "../actions/updateCategoryAction";

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { slug: string; name: string };
    }) => updateCategoryAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
