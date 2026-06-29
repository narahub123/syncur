import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { feedFetchObservationService } from "@/features/feed-fetch-observation/services/FeedFetchObservationService.instance";
import { FeedModel } from "@/features/feeds/model/feed";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { RSS_CONFIG } from "@/ingestion/rss/rss-config";
import { fetchCrawl } from "./pipelines/crawl/fetchCrawl";

export async function runRecovery() {
  /**
   * 1. 복구 후보 조회
   * - disabled 상태
   * - cooldown 지난 feed만
   */
  const feeds = await FeedModel.find({
    status: RSS_CONFIG.STATUS.DISABLED,
    disabledAt: {
      $lt: new Date(Date.now() - RSS_CONFIG.RECOVERY_COOLDOWN_MS),
    },
  });

  for (const feed of feeds) {
    const execution = await feedExecutionLogService.startExecution(feed._id);
    const executionId = execution.executionId;
    const feedUrl = feed.feedUrl ?? feed.listingPageUrl ?? "unknown";

    try {
      /**
       * 2. sourceType 분기
       */
      if (feed.sourceType === "rss") {
        /**
         * RSS: lightweight fetch (캐싱 + retry 포함)
         */
        const result = await fetchRSS(feed.toObject(), executionId, (log) =>
          feedFetchObservationService.record(log),
        );

        if (result.type === "NOT_MODIFIED") {
          await FeedModel.updateOne(
            { _id: feed._id },
            {
              $set: {
                status: RSS_CONFIG.STATUS.ACTIVE,
                errorCount: 0,
                lastFetchedAt: new Date(),
              },
              $unset: { disabledAt: 1 },
            },
          );

          console.log(`[RECOVERY] revived (cached): ${feedUrl}`);
          continue;
        }

        /**
         * OK → XML 파싱으로 정상 여부 확인
         */
        parseRSS(result.xml);
      } else if (feed.sourceType === "crawl") {
        /**
         * Crawl: fetch만으로 정상 여부 확인
         * (파싱까지는 하지 않음 — RSS와 동일한 lightweight 수준)
         */
        const result = await fetchCrawl(feed.toObject());

        if (result.type === "NOT_MODIFIED") {
          await FeedModel.updateOne(
            { _id: feed._id },
            {
              $set: {
                status: RSS_CONFIG.STATUS.ACTIVE,
                errorCount: 0,
                lastFetchedAt: new Date(),
              },
              $unset: { disabledAt: 1 },
            },
          );

          console.log(`[RECOVERY] revived (cached): ${feedUrl}`);
          continue;
        }
      }

      /**
       * 3. 정상 복구 처리
       */
      await FeedModel.updateOne(
        { _id: feed._id },
        {
          $set: {
            status: RSS_CONFIG.STATUS.ACTIVE,
            errorCount: 0,
            lastFetchedAt: new Date(),
          },
          $unset: { disabledAt: 1 },
        },
      );

      console.log(`[RECOVERY] revived: ${feedUrl}`);
    } catch (err) {
      /**
       * 4. 실패 → disabled 유지 + cooldown 갱신
       */
      await FeedModel.updateOne(
        { _id: feed._id },
        { $set: { disabledAt: new Date() } },
      );

      console.log(`[RECOVERY FAILED] ${feedUrl}`, err);
    }
  }
}
