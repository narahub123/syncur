"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { APP_ERROR_MESSAGE_MAP } from "../constants/message";

/**
 * URL의 앱 에러 코드를 감지하여
 * 사용자에게 토스트 메시지를 표시한다.
 *
 * 사용 예:
 * /?app-error=LoginRequired
 *
 * 처리 대상:
 * - 로그인 필요
 * - 관심사 등록 필요
 * - 세션 만료
 *
 * OAuth 인증 에러는 처리하지 않는다.
 */
export default function AppErrorToast() {
  const searchParams = useSearchParams();
  const error = searchParams.get("app-error");

  useEffect(() => {
    /**
     * 앱 에러가 없는 경우
     * 아무 작업도 수행하지 않는다.
     */
    if (!error) {
      return;
    }

    /**
     * 에러 코드에 대응하는 메시지를 표시한다.
     *
     * 정의되지 않은 에러 코드는
     * Default 메시지를 사용한다.
     */
    toast.error(APP_ERROR_MESSAGE_MAP[error] ?? APP_ERROR_MESSAGE_MAP.Default);
  }, [error]);

  return null;
}
