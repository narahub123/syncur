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
       * 2. lightweight fetch (캐싱 + retry 포함)
       * - full ingestion 아님
       */
      const result = await fetchRSS(feed);

      /**
       * 3. NOT_MODIFIED → 살아있는 feed로 판단 가능
       */
      if (result.type === "NOT_MODIFIED") {
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

        console.log(`[RECOVERY] revived (cached): ${feed.feedUrl}`);
        continue;
      }

      /**
       * 4. OK → 실제 RSS 확인
       */
      const xml = result.xml;

      parseRSS(xml);

      /**
       * 5. 성공 → active 복구
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
       * 6. 실패 → disabled 유지 + cooldown 갱신
       */
      await FeedModel.updateOne(
        { _id: feed._id },
        {
          $set: {
            disabledAt: new Date(),
          },
        },
      );

      console.log(`[RECOVERY FAILED] ${feed.feedUrl}`, err);
    }
  }
}
