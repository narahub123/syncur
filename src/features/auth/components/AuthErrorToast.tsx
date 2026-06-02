"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { OAUTH_ERROR_MESSAGE_MAP } from "../constants/message";

/**
 * URL의 OAuth 에러 코드를 감지하여
 * 사용자에게 토스트 메시지를 표시한다.
 *
 * 예:
 * /?error=Configuration
 * /?error=AccessDenied
 */
export default function AuthErrorToast() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    /**
     * OAuth 에러가 없는 경우 처리하지 않는다.
     */
    if (!error) {
      return;
    }

    /**
     * OAuth 에러 코드에 대응하는 메시지를 표시한다.
     *
     * 정의되지 않은 에러 코드는
     * Default 메시지를 사용한다.
     */
    toast.error(
      OAUTH_ERROR_MESSAGE_MAP[error] ?? OAUTH_ERROR_MESSAGE_MAP.Default,
    );
  }, [error]);

  return null;
}
