"use client";

import { useEffect, useState } from "react";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { Bell, X } from "lucide-react"; // 💡 X 아이콘 임포트
import { storage, STORAGE_KEYS } from "@/shared/utils/storage";

export default function NotificationPermissionBanner() {
  const { isDefault, requestPermission } = useNotificationPermission();

  // 💡 사용자가 수동으로 닫았는지 기억하는 로컬 상태
  const [isDismissed, setIsDismissed] = useState(true);

  // 컴포넌트 마운트 시 사용자가 이전에 [닫기]를 눌렀었는지 로컬스토리지 확인
  useEffect(() => {
    const dismissed = storage.get(STORAGE_KEYS.HIDE_PERMISSION_BANNER);
    if (!dismissed) {
      setIsDismissed(false); // 닫은 기록이 없어야 비로소 화면에 보여줍니다.
    }
  }, []);

  /**
   * 배너 완전히 가리기(X) 핸들러
   */
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation(); // 버튼 클릭 전파 방지
    storage.set(STORAGE_KEYS.HIDE_PERMISSION_BANNER, true);
    setIsDismissed(true); // 화면에서 즉시 제거
  };

  // 💡 조건 추가: 이미 닫았거나 미설정 상태가 아니라면 화면에 그리지 않음
  if (!isDefault || isDismissed) return null;

  return (
    <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
      <div className="flex items-center gap-2">
        <Bell size={16} className="shrink-0 animate-pulse text-blue-600" />
        <span>실시간 알림을 받으려면 브라우저 알림을 허용해주세요.</span>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={requestPermission}
          className="rounded bg-blue-600 px-3 py-1.5 font-bold text-white transition-colors hover:bg-blue-700"
        >
          허용하기
        </button>
        {/* 💡 X 닫기 버튼 추가 */}
        <button
          onClick={handleDismiss}
          className="rounded p-1 text-blue-600 transition-colors hover:bg-blue-100"
          title="다시는 보지 않기"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
