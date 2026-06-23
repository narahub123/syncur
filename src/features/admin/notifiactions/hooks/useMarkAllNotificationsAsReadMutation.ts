import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "../api/markAllNotificationsAsRead";
import {
  NotificationWithSiteAndFeedExecutionLogDto,
  NotificationWithSiteAndFeedExecutionLogDtoPagedResponse,
} from "@/features/notifications/dtos/notificationDto";
import { NotificationTarget } from "@/features/notifications/constants/notification-target";

/**
 * 전체 알림 읽음 처리 Mutation
 */
export function useMarkAllNotificationsAsReadMutation(
  target: NotificationTarget,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(target),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["notifications", target],
      });

      const prev = queryClient.getQueryData(["admin-notifications"]);

      // optimistic update (전체 읽음 처리)
      queryClient.setQueryData(
        ["notifications", target],
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

      queryClient.invalidateQueries({
        queryKey: ["my-feed-items"], // 👈 실제 피드 목록을 담당하는 QueryKey
        exact: false, // 하위 필터(페이지, 카테고리 등)가 붙어있어도 통째로 갱신하기 위함
      });
    },
  });
}
