import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsReadAction } from "../actions/markNotificationAsReadAction";
import { NotificationDto } from "../dtos/notificationDto"; // DTO import

// 페이지네이션 응답 구조 (프로젝트 실제 구조와 맞추세요)
interface PaginatedNotifications {
  items: NotificationDto[];
  pagination: {
    page: number;
    totalPages: number;
  };
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsReadAction,

    onMutate: async (id: string) => {
      // 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["my-notifications"] });

      // 이전 데이터 저장
      const prevData = queryClient.getQueryData<PaginatedNotifications>([
        "my-notifications",
      ]);

      // 낙관적 업데이트
      queryClient.setQueriesData<PaginatedNotifications>(
        { queryKey: ["my-notifications"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            items: old.items.map((n) =>
              n._id === id ? { ...n, isRead: true } : n,
            ),
          };
        },
      );

      return { prevData };
    },

    onError: (_err, _id, context) => {
      if (context?.prevData) {
        queryClient.setQueriesData(
          { queryKey: ["my-notifications"] },
          context.prevData,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-notifications"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["notification-unread-count"],
        exact: false,
      });
    },
  });
}
