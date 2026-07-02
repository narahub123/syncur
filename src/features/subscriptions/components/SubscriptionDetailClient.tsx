"use client";

import { FEED_FILTER } from "@/features/keywords/constants/feed-filter";
import { NOTIFY_FILTER } from "@/features/keywords/constants/notify-filter";
import { useUpdateFeedFilterMutation } from "@/features/keywords/hooks/useFeedSettingUpdateFeedFilterMutation";
import { useUpdateNotifyFilterMutation } from "@/features/keywords/hooks/useFeedSettingUpdateNotifyFilterMutation";
import { useUserFeedSettingQuery } from "@/features/keywords/hooks/useUserFeedSettingQuery";

const SubscriptionDetailClient = ({
  subscriptionId,
}: {
  subscriptionId: string;
}) => {
  const { data: feedSettings } = useUserFeedSettingQuery(subscriptionId);

  const feedMutation = useUpdateFeedFilterMutation();
  const notifyMutation = useUpdateNotifyFilterMutation();

  console.log(feedSettings?.feedName);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border p-6">
        <h1 className="text-2xl font-semibold">{feedSettings?.feedName}</h1>

        <p className="text-muted-foreground mt-2 text-sm">
          이 구독에만 적용할 피드 및 알림 설정을 관리합니다.
        </p>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">피드</h2>

        <p className="text-muted-foreground mt-2 text-sm">
          이 구독에서 표시할 피드의 범위를 선택합니다.
        </p>

        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="feedFilter"
              checked={feedSettings?.feedFilter === FEED_FILTER.DEFAULT}
              onChange={() =>
                feedMutation.mutate({
                  subscriptionId,
                  feedFilter: FEED_FILTER.DEFAULT,
                })
              }
            />
            <span>기본 설정 사용</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="feedFilter"
              checked={feedSettings?.feedFilter === FEED_FILTER.ALL}
              onChange={() =>
                feedMutation.mutate({
                  subscriptionId,
                  feedFilter: FEED_FILTER.ALL,
                })
              }
            />
            <span>모든 피드</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="feedFilter"
              checked={feedSettings?.feedFilter === FEED_FILTER.KEYWORD_ONLY}
              onChange={() =>
                feedMutation.mutate({
                  subscriptionId,
                  feedFilter: FEED_FILTER.KEYWORD_ONLY,
                })
              }
            />
            <span>키워드만</span>
          </label>
        </div>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">알림</h2>

        <p className="text-muted-foreground mt-2 text-sm">
          이 구독에서 받을 알림의 범위를 선택합니다.
        </p>

        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="notifyFilter"
              checked={feedSettings?.notifyFilter === NOTIFY_FILTER.DEFAULT}
              onChange={() =>
                notifyMutation.mutate({
                  subscriptionId,
                  notifyFilter: NOTIFY_FILTER.DEFAULT,
                })
              }
            />
            <span>기본 설정 사용</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="notifyFilter"
              checked={feedSettings?.notifyFilter === NOTIFY_FILTER.ALL}
              onChange={() =>
                notifyMutation.mutate({
                  subscriptionId,
                  notifyFilter: NOTIFY_FILTER.ALL,
                })
              }
            />
            <span>모든 알림</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="notifyFilter"
              checked={
                feedSettings?.notifyFilter === NOTIFY_FILTER.KEYWORD_ONLY
              }
              onChange={() =>
                notifyMutation.mutate({
                  subscriptionId,
                  notifyFilter: NOTIFY_FILTER.KEYWORD_ONLY,
                })
              }
            />
            <span>키워드만</span>
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="rounded-md border px-4 py-2">저장</button>
      </div>
    </div>
  );
};

export default SubscriptionDetailClient;
