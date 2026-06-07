import cron from "node-cron";
import mongoose from "mongoose";
import { FeedModel } from "@/features/feeds/model/feed";
import { runFeedIngestion } from "@/ingestion/rss/runFeedIngestion";
import dotenv from "dotenv";
import { RSS_CONFIG } from "@/ingestion/rss/rss-config";

dotenv.config({ path: ".env.local" });

/**
 * RSS Cron Entry
 *
 * - 10분마다 실행
 * - active feed만 처리
 * - ingestion pipeline 호출만 담당
 */
async function runCron() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  let isRunning = false;

  cron.schedule(RSS_CONFIG.CRON_SCHEDULE, async () => {
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
       * - status = active → 정상 동작 feed만
       * - lastFetchedAt 기준 필터:
       *   → 10분 이내에 이미 처리된 feed는 제외
       *
       * 목적:
       * - 불필요한 RSS fetch 방지
       * - 외부 RSS 서버 부하 감소
       */
      const feeds = await FeedModel.find({
        status: "active",
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
