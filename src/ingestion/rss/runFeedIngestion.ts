import { FeedDocument, FeedModel } from "@/features/feeds/model/feed";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { upsertFeedItems } from "@/ingestion/rss/upsertFeedItems";

/**
 * RSS Feed ingestion unit
 *
 * - cron / worker 어디서든 재사용 가능
 * - feed 1개만 책임짐
 * - idempotent (재실행 안전)
 */
export async function runFeedIngestion(feed: FeedDocument) {
  const feedId = feed._id.toString();

  try {
    /**
     * 0. 상태 가드
     */
    if (feed.status === "disabled") {
      return;
    }

    /**
     * 1. Fetch RSS XML
     * - timeout은 fetchRSS 내부에서 처리한다고 가정
     */
    const xml = await fetchRSS(feed.feedUrl);

    /**
     * 2. Parse XML → normalized items
     */
    const items = parseRSS(xml);

    /**
     * 3. Upsert (idempotent sync)
     */
    await upsertFeedItems(feedId, items);

    /**
     * 4. 성공 상태 업데이트
     *
     * - RSS 정상 fetch + parse + upsert 완료
     * - 상태를 active로 복구
     * - errorCount 초기화 (연속 실패 기록 제거)
     */
    await FeedModel.updateOne(
      { _id: feed._id },
      {
        $set: {
          lastFetchedAt: new Date(),
          status: "active",
          errorCount: 0,
        },
      },
    );

    return {
      feedId,
      status: "success",
      items: items.length,
    };
  } catch (err) {
    /**
     * 5. 실패 상태 처리
     *
     * - errorCount 증가
     * - 상태를 error로 변경
     * - 연속 실패 누적 관리
     */
    const updatedFeed = await FeedModel.findByIdAndUpdate(
      feed._id,
      {
        $inc: { errorCount: 1 },
        $set: { status: "error" },
      },
      { new: true },
    );

    /**
     * 6. disable 정책
     *
     * - 연속 실패가 threshold를 넘으면
     *   더 이상 cron 대상에서 제외
     */
    if (updatedFeed && updatedFeed.errorCount >= 5) {
      await FeedModel.updateOne(
        { _id: feed._id },
        {
          $set: { status: "disabled" },
        },
      );
    }

    console.error("[RSS INGESTION ERROR]", {
      feedId,
      feedUrl: feed.feedUrl,
      error: err,
    });

    return {
      feedId,
      status: "error",
    };
  }
}
