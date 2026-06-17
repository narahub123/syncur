"use client";

import { useState, useEffect } from "react";
import { RotateCcw, CheckCircle } from "lucide-react";
import { storage, STORAGE_KEYS } from "@/shared/utils/storage";

export default function NotificationSettingsControl() {
  const [hasHiddenBanners, setHasHiddenBanners] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  // 현재 브라우저에 숨겨진 배너 기록이 존재하는지 실시간 체크
  const checkStorage = () => {
    const hidePermission = storage.get(STORAGE_KEYS.HIDE_PERMISSION_BANNER);
    const hideDenied = storage.get(STORAGE_KEYS.HIDE_DENIED_BANNER);
    setHasHiddenBanners(!!hidePermission || !!hideDenied);
  };

  useEffect(() => {
    checkStorage();
  }, []);

  /**
   * 숨겨진 배너 기억을 초기화하여 다시 보여주는 핸들러
   */
  const handleResetBanners = () => {
    storage.remove(STORAGE_KEYS.HIDE_PERMISSION_BANNER);
    storage.remove(STORAGE_KEYS.HIDE_DENIED_BANNER);

    // 시각적 피드백 주기
    setIsResetSuccess(true);
    setHasHiddenBanners(false);

    // 💡 핵심: 상태를 즉시 동기화하기 위해 화면을 부드럽게 새로고침하거나
    // 유저에게 알림 메인 홈으로 새로고침 유도
    setTimeout(() => {
      setIsResetSuccess(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="w-full">
      <h3 className="mb-1 text-sm font-bold text-gray-900">
        실시간 알림 배너 제어
      </h3>
      <p className="mb-3 text-xs leading-relaxed text-gray-500">
        실수로 알림 안내 배너의 &apos;닫기(X)&apos;를 눌러 숨겨진 경우, 아래
        버튼을 통해 다시 화면 상단에 표시되도록 복구할 수 있습니다.
      </p>

      {isResetSuccess ? (
        <div className="flex items-center gap-1.5 py-2 text-xs font-medium text-green-600">
          <CheckCircle size={14} />
          <span>
            안내 배너가 성공적으로 복구되었습니다! 잠시 후 적용됩니다.
          </span>
        </div>
      ) : (
        <button
          onClick={handleResetBanners}
          disabled={!hasHiddenBanners}
          className={`flex items-center gap-1.5 rounded px-3 py-2 text-xs font-semibold transition-colors ${
            hasHiddenBanners
              ? "cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "cursor-not-allowed bg-gray-50 text-gray-400"
          } `}
        >
          <RotateCcw size={14} />
          <span>
            {hasHiddenBanners
              ? "숨겨진 알림 배너 다시 표시하기"
              : "숨겨진 배너 없음"}
          </span>
        </button>
      )}
    </div>
  );
}
