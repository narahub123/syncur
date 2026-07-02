import { FEED_FILTER } from "@/features/keywords/constants/feed-filter";
import { NOTIFY_FILTER } from "@/features/keywords/constants/notify-filter";
import { useUpdateFeedFilterMutation } from "@/features/keywords/hooks/useUpdateFeedFilterMutation";
import { useUpdateNotifyFilterMutation } from "@/features/keywords/hooks/useUpdateNotifyFilterMutation";
import { useUserKeywordSettingQuery } from "@/features/keywords/hooks/useUserKeywordSettingQuery";

const DefaultSettingSection = () => {
  const { data: setting } = useUserKeywordSettingQuery();

  const feedMutation = useUpdateFeedFilterMutation();
  const notifyMutation = useUpdateNotifyFilterMutation();

  return (
    <section className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold">기본 설정</h2>

      <div className="mt-6 space-y-8">
        {/* FEED */}
        <div>
          <h3 className="font-medium">피드 기본 설정</h3>

          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={setting?.defaultFeedFilter === FEED_FILTER.ALL}
                onChange={() => feedMutation.mutate(FEED_FILTER.ALL)}
              />
              모든 피드 보기
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={
                  setting?.defaultFeedFilter === FEED_FILTER.KEYWORD_ONLY
                }
                onChange={() => feedMutation.mutate(FEED_FILTER.KEYWORD_ONLY)}
              />
              키워드가 포함된 피드만 보기
            </label>
          </div>
        </div>

        {/* NOTIFY */}
        <div>
          <h3 className="font-medium">알림 기본 설정</h3>

          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={setting?.defaultNotifyFilter === NOTIFY_FILTER.ALL}
                onChange={() => notifyMutation.mutate(NOTIFY_FILTER.ALL)}
              />
              모든 알림 받기
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={
                  setting?.defaultNotifyFilter === NOTIFY_FILTER.KEYWORD_ONLY
                }
                onChange={() =>
                  notifyMutation.mutate(NOTIFY_FILTER.KEYWORD_ONLY)
                }
              />
              키워드가 포함된 알림만 받기
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DefaultSettingSection;
