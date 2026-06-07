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
