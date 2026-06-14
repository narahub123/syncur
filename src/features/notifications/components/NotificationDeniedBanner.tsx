"use client";

import { useEffect, useState } from "react";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { AlertTriangle, X } from "lucide-react"; // 💡 X 아이콘 임포트
import { storage, STORAGE_KEYS } from "@/shared/utils/storage";

export default function NotificationDeniedBanner() {
  const { isDenied } = useNotificationPermission();
  const [showGuide, setShowGuide] = useState(false);

  // 💡 사용자가 수동으로 닫았는지 기억하는 로컬 상태
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = storage.get(STORAGE_KEYS.HIDE_DENIED_BANNER);
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  /**
   * 배너 완전히 가리기(X) 핸들러
   */
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    storage.set(STORAGE_KEYS.HIDE_DENIED_BANNER, true);
    setIsDismissed(true);
  };

  // 💡 조건 추가: 이미 닫았거나 차단 상태가 아니라면 화면에 그리지 않음
  if (!isDenied || isDismissed) return null;

  return (
    <div className="relative border-b border-red-200 bg-red-50 text-red-800 transition-all">
      <div className="flex items-center justify-between p-3 text-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0 text-red-600" />
          <span>
            브라우저 알림이 차단되어 있습니다. <br />
            실시간 알림을 받으려면 직접 설정을 풀어주셔야 합니다.
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => setShowGuide((prev) => !prev)}
            className="rounded bg-red-600 px-3 py-1.5 font-bold text-white transition-colors hover:bg-red-700"
          >
            {showGuide ? "닫기" : "허용 방법 보기"}
          </button>
          {/* 💡 X 닫기 버튼 추가 */}
          <button
            onClick={handleDismiss}
            className="rounded p-1 text-red-600 transition-colors hover:bg-red-100"
            title="다시는 보지 않기"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="border-t border-red-100 bg-white p-4 text-xs leading-relaxed text-gray-700 shadow-inner">
          <p className="mb-1 text-sm font-bold text-red-900">
            🔒 브라우저 알림 직접 허용 방법
          </p>
          <p>
            브라우저 보안 정책 때문에 자동으로 창을 열 수 없습니다. 아래
            순서대로 1초 만에 풀어보세요:
          </p>
          <ol className="mt-1.5 list-decimal space-y-1 pl-4 font-medium text-gray-800">
            <li>
              화면 맨 위 주소창 왼쪽의{" "}
              <span className="font-bold text-red-600">자물쇠(🔒) 아이콘</span>
              을 마우스로 클릭합니다.
            </li>

            {/* 💡 79번 줄 수정: 날것의 "알림" 대신 {"\"알림\""} 또는 {"'알림'"} 구문으로 처리하여 ESLint 에러 차단 */}
            <li>
              메뉴 목록 중에서{" "}
              <span className="font-bold text-red-600">{'"알림"'}</span> 항목을
              찾습니다.
            </li>

            {/* 💡 83번 줄 수정: 날것의 "허용" 대신 {"\"허용\""} 구문으로 처리하여 ESLint 에러 차단 */}
            <li>
              선택 상자를{" "}
              <span className="font-bold text-red-600">{'"허용"'}</span>으로
              변경해 주세요!
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
