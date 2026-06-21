import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInterestAction } from "../actions/updateInterestAction";

export const useUpdateInterestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateInterestAction>[1];
    }) => updateInterestAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
    },
  });
};
