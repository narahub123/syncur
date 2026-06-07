import { FeedModel } from "@/features/feeds/model/feed";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { RSS_CONFIG } from "@/ingestion/rss/rss-config";

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
    try {
      /**
       * 2. lightweight test fetch
       * - 전체 ingestion 아님
       * - "살아있는지만 확인"
       */
      const xml = await fetchRSS(feed.feedUrl);

      parseRSS(xml);

      /**
       * 3. 성공 → active 복구
       */
      await FeedModel.updateOne(
        { _id: feed._id },
        {
          $set: {
            status: RSS_CONFIG.STATUS.ACTIVE,
            errorCount: 0,
            lastFetchedAt: new Date(),
          },
          $unset: {
            disabledAt: 1,
          },
        },
      );

      console.log(`[RECOVERY] revived: ${feed.feedUrl}`);
    } catch (err) {
      /**
       * 4. 실패 → disabled 유지
       * - cooldown reset 안 함 (시간 계속 흐르게)
       */
      await FeedModel.updateOne(
        { _id: feed._id },
        {
          $set: {
            disabledAt: new Date(),
          },
        },
      );

      console.log(`[RECOVERY FAILED] ${feed.feedUrl}`);
    }
  }
}
