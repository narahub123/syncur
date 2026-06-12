import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../api/markNotificationAsRead";
import {
  NotificationWithSiteAndFeedExecutionLogDto,
  NotificationWithSiteAndFeedExecutionLogDtoPagedResponse,
} from "@/features/notifications/dtos/notificationDto";

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),

    onMutate: async (id) => {
      // optimistic update
      await queryClient.cancelQueries({
        queryKey: ["admin-notifications"],
      });

      const prev = queryClient.getQueryData(["admin-notifications"]);

      queryClient.setQueryData(
        ["admin-notifications"],
        (old: NotificationWithSiteAndFeedExecutionLogDtoPagedResponse) => {
          if (!old) return old;

          return {
            ...old,
            items: old.items.map(
              (n: NotificationWithSiteAndFeedExecutionLogDto) =>
                n._id === id ? { ...n, isRead: true } : n,
            ),
          };
        },
      );

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(["admin-notifications"], ctx?.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications"],
      });
    },
  });
}
