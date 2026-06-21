import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { UserInteractionStatsDTO } from "../dto/UserInteractionStatsDTO";
import { UserFeedInteractionPopulatedDto } from "../dto/UserInteractionDto";

type Props = {
  activity: {
    stats: UserInteractionStatsDTO;
    items: UserFeedInteractionPopulatedDto[];
    totalCount: number;
  };
};

export const UserActivityCard = ({ activity }: Props) => {
  const { stats, items } = activity;

  const getLatestActionLabel = (item: UserFeedInteractionPopulatedDto) => {
    const actions = [
      { time: item.lastLikedAt, label: "좋아요" },
      { time: item.lastBookmarkedAt, label: "북마크" },
      { time: item.lastContentClickedAt, label: "본문 클릭" },
      { time: item.lastSourceClickedAt, label: "사이트 이동" },
    ];

    // null이 아닌 것만 필터링하고 시간순으로 정렬하여 가장 최근 것 추출
    const latest = actions
      .filter((a) => a.time !== null)
      .sort(
        (a, b) => new Date(b.time!).getTime() - new Date(a.time!).getTime(),
      )[0];

    return latest ? latest.label : "활동 없음";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>활동 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1. 요약 섹션 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/20 rounded-lg border p-4 text-center">
            <p className="text-muted-foreground text-sm">좋아요</p>
            <p className="text-2xl font-bold">{stats.totalLiked}</p>
          </div>
          <div className="bg-muted/20 rounded-lg border p-4 text-center">
            <p className="text-muted-foreground text-sm">북마크</p>
            <p className="text-2xl font-bold">{stats.totalBookmarked}</p>
          </div>
          <div className="bg-muted/20 rounded-lg border p-4 text-center">
            <p className="text-muted-foreground text-sm">본문 클릭</p>
            <p className="text-2xl font-bold">{stats.totalClicked}</p>
          </div>
        </div>

        {/* 2. 타임라인 섹션 */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">최근 활동</h4>
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div className="truncate pr-4">
                    <p className="truncate font-medium">
                      {item.feedItemId.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {item.lastInteractedAt
                        ? new Date(item.lastInteractedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    <p>{getLatestActionLabel(item)}</p>
                    <p>
                      {item.lastInteractedAt
                        ? new Date(item.lastInteractedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-sm">
              활동 내역이 없습니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
