import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "../api/markAllNotificationsAsRead";
import {
  NotificationWithSiteAndFeedExecutionLogDto,
  NotificationWithSiteAndFeedExecutionLogDtoPagedResponse,
} from "@/features/notifications/dtos/notificationDto";

/**
 * 전체 알림 읽음 처리 Mutation
 */
export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["admin-notifications"],
      });

      const prev = queryClient.getQueryData(["admin-notifications"]);

      // optimistic update (전체 읽음 처리)
      queryClient.setQueryData(
        ["admin-notifications"],
        (old: NotificationWithSiteAndFeedExecutionLogDtoPagedResponse) => {
          if (!old) return old;

          return {
            ...old,
            items: old.items.map(
              (n: NotificationWithSiteAndFeedExecutionLogDto) => ({
                ...n,
                isRead: true,
              }),
            ),
          };
        },
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin-notifications"], ctx?.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications"],
      });
    },
  });
}
