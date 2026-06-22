import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { feedFetchObservationService } from "@/features/feed-fetch-observation/services/FeedFetchObservationService.instance";
import { FeedModel } from "@/features/feeds/model/feed";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { RSS_CONFIG } from "@/ingestion/rss/rss-config";

/**
 * 개선 여지 (전체 구조)
 * - recovery는 "batch job + state machine" 성격인데
 *   현재는 procedural loop로 구현됨
 * - job scheduler / queue 기반 구조로 확장 가능
 */
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
    /**
     * execution을 feed 단위로 생성하고 있음
     *
     * 개선 여지:
     * - 현재 구조는 feed마다 execution 생성됨
     * - recovery run 전체를 1 execution으로 묶는 것이
     *   분석 / 추적 / 비교 측면에서 더 일관됨
     */
    const execution = await feedExecutionLogService.startExecution(feed._id);
    const executionId = execution.executionId;
    try {
      /**
       * 2. lightweight fetch (캐싱 + retry 포함)
       * - full ingestion 아님
       */
      /**
       * execution을 feed 단위로 생성하고 있음
       *
       * 개선 여지:
       * - 현재 구조는 feed마다 execution 생성됨
       * - recovery run 전체를 1 execution으로 묶는 것이
       *   분석 / 추적 / 비교 측면에서 더 일관됨
       */
      const result = await fetchRSS(feed, executionId, (log) =>
        feedFetchObservationService.record(log),
      );

      /**
       * NOT_MODIFIED = feed 정상 상태로 간주
       *
       * 개선 여지:
       * - 상태 변경 로직이 recovery 내부에 흩어져 있음
       * - domain service로 분리하면 재사용성 증가
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
       * OK = 정상 복구 처리
       *
       * 개선 여지:
       * - parseRSS 결과를 현재 사용하지 않고 있음
       * - 실제 item ingestion으로 이어지지 않는 구조라면
       *   recovery와 ingestion 책임 분리가 필요
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
      /**
       * FAIL 처리
       *
       * 개선 여지:
       * - 실패 사유가 feed 상태에 반영되지 않음 (silent failure)
       * - errorCode / retry count / failure reason 저장 고려 필요
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
