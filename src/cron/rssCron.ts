import cron from "node-cron";
import mongoose from "mongoose";
import { FeedModel } from "@/features/feeds/model/feed";
import { runFeedIngestion } from "@/ingestion/rss/runFeedIngestion";
import dotenv from "dotenv";
import { RSS_CONFIG } from "@/ingestion/rss/rss-config";
import { runRecovery } from "@/ingestion/rss/runRecovery";

dotenv.config({ path: ".env.local" });

/**
 * RSS Cron Entry
 *
 * === 전체 구조 ===
 * 1. recovery (disabled → active 복구 시도)
 * 2. ingestion (active feed 처리)
 *
 * === 설계 철학 ===
 * - recovery는 "복구 레이어"
 * - ingestion은 "데이터 수집 레이어"
 * - 둘은 독립이지만 같은 cycle에서 연결됨
 */
async function runCron() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  let isRunning = false;

  cron.schedule(RSS_CONFIG.CRON_SCHEDULE, async () => {
    /**
     * 0. Recovery 단계 (선행 실행)
     *
     * - disabled 상태 feed 중 복구 가능한 feed를 먼저 활성화 시도
     * - ingestion cron 이전에 실행하여 "살아날 feed"를 먼저 복원
     *
     * 이유:
     * - recovery 성공 feed는 이번 cycle에서 바로 ingestion 대상이 될 수 있음
     * - ingestion과 recovery는 독립된 lifecycle이지만 같은 cycle에서 연결됨
     */
    await runRecovery();

    /**
     * cron 중복 실행 방지 플래그
     * - 이전 실행이 끝나기 전에 다시 실행되는 것을 방지
     * - node-cron은 overlap 방지를 기본 제공하지 않기 때문에 필수
     */
    if (isRunning) {
      console.log("[RSS CRON] skipped - already running");
      return;
    }

    isRunning = true;

    try {
      console.log("[RSS CRON] start");

      /**
       * 1. 처리 대상 feed 조회
       *
       * 조건:
       * - status = active → 정상 동작 feed만 처리
       * - errorCount < threshold → 과도 실패 feed 제외
       * - lastFetchedAt 기준 throttling → 과도한 fetch 방지
       *
       * 목적:
       * - RSS 서버 부하 최소화
       * - 동일 feed 중복 fetch 방지
       * - 안정적인 ingestion cycle 유지
       */
      const feeds = await FeedModel.find({
        status: "active",
        errorCount: { $lt: RSS_CONFIG.ERROR_THRESHOLD },
        $or: [
          { lastFetchedAt: null },
          {
            lastFetchedAt: {
              $lt: new Date(Date.now() - RSS_CONFIG.FETCH_INTERVAL_MS),
            },
          },
        ],
      }).sort({ lastFetchedAt: 1 });

      console.log(`[RSS CRON] feeds: ${feeds.length}`);

      /**
       * 2. feed 순차 처리
       *
       * 설계 의도:
       * - MVP 단계에서는 안정성을 위해 concurrency 사용하지 않음
       * - feed 하나 실패해도 전체 cron은 계속 진행
       */
      for (const feed of feeds) {
        try {
          /**
           * ingestion 실행
           * - RSS fetch → parse → DB upsert
           * - feed 상태 업데이트 포함
           */
          await runFeedIngestion(feed);
        } catch (err) {
          /**
           * 개별 feed 실패 처리
           * - cron 전체를 중단시키지 않음
           * - 실패 feed는 ingestion 내부에서 errorCount 처리됨
           */
          console.error("[FEED INGEST ERROR]", feed.feedUrl, err);
        }
      }

      console.log("[RSS CRON] done");
    } catch (err) {
      /**
       * cron 전체 레벨 에러
       * - DB 연결 문제
       * - query 실패
       * - runtime error 등
       */
      console.error("[CRON ERROR]", err);
    } finally {
      /**
       * 실행 상태 초기화
       * - 다음 cron 실행 가능 상태로 복구
       */
      isRunning = false;
    }
  });
}

/**
 * 실행
 */
runCron().catch((err) => {
  console.error("[CRON BOOT ERROR]", err);
  process.exit(1);
});
