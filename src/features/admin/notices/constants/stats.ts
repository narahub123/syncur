import { NoticeStatsDto } from "../dto/noticeStatsDto";

export const defaultNoticeStats = {
  totalCount: 0,
  activeCount: 0,
  inactiveCount: 0,
  pinnedCount: 0,
};

export const getNoticeStatusList = (stats: NoticeStatsDto) => [
  {
    label: "공개",
    value: stats.activeCount,
    color: "green",
  },
  {
    label: "비공개",
    value: stats.inactiveCount,
    color: "red",
  },
  {
    label: "상단 고정",
    value: stats.pinnedCount,
    color: "violet",
  },
];
