type FeedPublishedTime = {
  display: string;
  full: string;
};

export const formatFeedPublishedTime = (
  date: Date | string,
): FeedPublishedTime => {
  const target = new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - target.getTime();
  const DAY = 24 * 60 * 60 * 1000;

  const full = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(target);

  if (diffMs < DAY) {
    return {
      display: new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(target),
      full,
    };
  }

  return {
    display: new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(target),
    full,
  };
};

type RelativeTimeResult = {
  display: string;
  full: string;
};

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/**
 * 상대시간 + 상세시간 동시 반환
 *
 * - display: UI용 짧은 표현 (예: 3분 전 / 14:30)
 * - full: 상세 날짜/시간 (예: 2026.06.09 오후 2:30)
 */
export function formatRelativeTime(
  date: Date | string | null,
): RelativeTimeResult {
  if (!date) {
    return {
      display: "",
      full: "",
    };
  }

  const target = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  const diffMs = now.getTime() - target.getTime();

  const full = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(target);

  // =========================
  // 1. 1일 이내 → 시간 표시
  // =========================
  if (diffMs < DAY) {
    return {
      display: new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(target),
      full,
    };
  }

  // =========================
  // 2. 7일 이내 → 일 단위
  // =========================
  const days = Math.floor(diffMs / DAY);
  if (days < 7) {
    return {
      display: `${days}일 전`,
      full,
    };
  }

  // =========================
  // 3. 30일 이내 → 주 단위
  // =========================
  const weeks = Math.floor(days / 7);
  if (days < 30) {
    return {
      display: `${weeks}주 전`,
      full,
    };
  }

  // =========================
  // 4. 1년 이내 → 월 단위
  // =========================
  const months = Math.floor(days / 30);
  if (days < 365) {
    return {
      display: `${months}개월 전`,
      full,
    };
  }

  // =========================
  // 5. 1년 이상 → 년 단위
  // =========================
  const years = Math.floor(days / 365);

  return {
    display: `${years}년 전`,
    full,
  };
}
