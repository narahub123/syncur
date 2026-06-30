import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationTarget } from "@/features/notifications/constants/notification-target";
import { NotificationType } from "@/features/notifications/constants/notification-type";
import { markAllNotificationsAsReadAction } from "@/features/admin/notifiactions/actions/markAllNotificationsAsReadAction";

/**
 * 사용자 전체 알림 읽음 처리 Mutation
 */
export function useMarkAllNotificationsAsReadMutation(
  target: NotificationTarget,
  types?: NotificationType[],
) {
  const queryClient = useQueryClient();

  return useMutation({
    // Server Action을 호출하도록 mutationFn 수정
    mutationFn: () => markAllNotificationsAsReadAction(target, types),

    onSuccess: () => {
      // ["my-notifications"]로 시작하는 모든 쿼리 무효화
      // 사용자 알림 목록이 즉시 갱신됩니다.
      queryClient.invalidateQueries({
        queryKey: ["my-notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notification-unread-count"],
        exact: false,
      });
    },
  });
}
