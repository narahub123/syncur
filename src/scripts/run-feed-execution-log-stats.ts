import mongoose from "mongoose";
import dotenv from "dotenv";
import { FeedExecutionLogModel } from "@/features/feed-execution-logs/model/feed-execution-log";
import { FEED_EXECUTION_STATUS } from "@/features/feed-execution-logs/constants/feed-execution-log";
import { FeedExecutionLogStatsModel } from "@/features/feed-execution-logs/model/FeedExecutionLogStat";

dotenv.config({ path: ".env.local" });

async function populate() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("DB 연결 성공");

  // 1. 전체 실행 로그 조회
  const logs = await FeedExecutionLogModel.find().lean();

  console.log("현재 DB에 저장된 Execution Log 개수:", logs.length);
  console.log("조회된 첫 번째 Execution Log:", logs[0]);

  // 2. 통계 계산
  const total = logs.length;

  const fails = logs.filter(
    (log) => log.status === FEED_EXECUTION_STATUS.FAILED,
  ).length;

  console.log(`계산값 -> total: ${total}, fails: ${fails}`);

  // 3. 통계 저장
  const updateResult = await FeedExecutionLogStatsModel.updateOne(
    {
      key: "feed_execution_log_stats_main",
    },
    {
      $set: {
        key: "feed_execution_log_stats_main",
        total,
        fails,
        updatedAt: new Date(),
      },
    },
    {
      upsert: true,
    },
  );

  console.log("삽입/업데이트 결과:", updateResult);

  // 4. 최종 확인
  const finalData = await FeedExecutionLogStatsModel.findOne({
    key: "feed_execution_log_stats_main",
  });

  console.log("DB에 저장된 최종 데이터:", finalData);

  process.exit(0);
}

populate();
