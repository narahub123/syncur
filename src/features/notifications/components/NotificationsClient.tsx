"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyNotificationsQuery } from "../hooks/useMyNotificationsQuery";
import { NOTIFICATION_TYPE } from "../constants/notification-type";
import { NotificationPagination } from "./NotificationPagination";
import { useMarkAllNotificationsAsReadMutation } from "../hooks/useMarkAllNotificationsAsReadMutation";
import { NOTIFICATION_TARGET } from "../constants/notification-target";
import { NotificationDto } from "../dtos/notificationDto";
import { useMarkNotificationAsReadMutation } from "../hooks/useMarkNotificationAsReadMutation";
import { useRouter } from "next/navigation";

export function NotificationsClient() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useMyNotificationsQuery({
    page,
    limit: 10,
  });

  const markAsReadMutation = useMarkNotificationAsReadMutation();

  // 전체 읽음 처리 Mutation 훅 사용
  const markAllReadMutation = useMarkAllNotificationsAsReadMutation(
    NOTIFICATION_TARGET.USER,
    [NOTIFICATION_TYPE.INQUIRY_REPLIED, NOTIFICATION_TYPE.BUG_REPORT_REPLIED],
  );

  // 모두 읽음 처리 핸들러
  const handleReadAll = () => {
    markAllReadMutation.mutate();
  };

  const getNotificationUrl = (notification: NotificationDto) => {
    const { type, metadata } = notification;
    if (type === NOTIFICATION_TYPE.INQUIRY_REPLIED) {
      return `/support/requests/${metadata?.requestId}`;
    }
    if (type === NOTIFICATION_TYPE.BUG_REPORT_REPLIED) {
      return `/support/requests/${metadata?.requestId}`;
    }
    return "#";
  };

  // 날짜 표시를 위한 간단한 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  };

  const handleNotificationClick = async (notification: NotificationDto) => {
    // 1. 읽지 않은 경우에만 읽음 처리 요청
    if (!notification.isRead) {
      try {
        // await로 확실히 완료를 기다림
        await markAsReadMutation.mutateAsync(notification._id);
      } catch (err) {
        console.error("읽음 처리 실패:", err);
      }
    }

    // 2. 호출 완료 후(또는 실패해도) 페이지 이동
    router.push(getNotificationUrl(notification));
  };

  if (isPending)
    return (
      <div className="flex animate-pulse justify-center p-20 text-gray-400">
        불러오는 중...
      </div>
    );
  if (isError || !data)
    return (
      <div className="p-10 text-center text-red-500">
        알림을 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="mx-auto flex min-h-[600px] max-w-2xl flex-col p-4 md:p-6">
      <div className="flex-grow">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            내 알림
          </h2>
          {/* 모두 읽음 버튼 */}
          <button
            onClick={handleReadAll} // 이 함수를 아래에 구현하면 됩니다
            className="text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
          >
            모두 읽음
          </button>
        </div>

        {data.items.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
            <p className="text-gray-400">새로운 알림이 없습니다.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {data.items.map((notification) => {
              const isUnread = !notification.isRead;
              return (
                <li key={notification._id}>
                  <Link
                    href={getNotificationUrl(notification)}
                    onClick={() => handleNotificationClick(notification)}
                    className={`block rounded-2xl border p-5 transition-all duration-200 ${
                      isUnread
                        ? "border-blue-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md"
                        : "border-gray-100 bg-gray-50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* 상태 표시 Dot - 읽지 않은 경우만 강조 */}
                      {isUnread && (
                        <div className="relative mt-1.5 h-3 w-3 shrink-0">
                          <span className="absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-600"></span>
                        </div>
                      )}

                      {/* 아이콘 영역 (선택사항, 타입을 직관적으로 보여주기 위해 추가하면 좋습니다) */}
                      {/* <div className={`p-2.5 rounded-full ${isUnread ? 'bg-blue-100' : 'bg-gray-100'}`}> */}
                      {/* {notification.type.includes('REPLIED') ? <ReplyIcon/> : <BellIcon/>} */}
                      {/* </div> */}

                      <div className="flex-grow">
                        <div className="mb-1.5 flex items-baseline justify-between">
                          <span
                            className={`font-semibold ${isUnread ? "text-gray-950" : "text-gray-600"} tracking-tight`}
                          >
                            {notification.title}
                          </span>
                          <span
                            className={`ml-4 flex-shrink-0 text-xs ${isUnread ? "font-medium text-blue-600" : "text-gray-400"}`}
                          >
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p
                          className={`text-sm leading-relaxed ${isUnread ? "text-gray-800" : "text-gray-500"}`}
                        >
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 페이지네이션 연결 */}
      <NotificationPagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
          window.scrollTo(0, 0);
        }}
      />
    </div>
  );
}
