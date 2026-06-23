import mongoose from "mongoose";
import dotenv from "dotenv";
import { BUG_REPORT_STATUS } from "@/features/admin/bug-reports/types/search"; // 컨벤션에 맞춘 상태 상수
import { RequestModel } from "@/features/support/requests/model/Request";
import { REQUEST_TYPE } from "@/features/support/requests/constants/request-type";
import { BugReportStatsModel } from "@/features/support/bug-reports/model/BugReportStats";
import { BUG_REPORT_STATS_KEY } from "@/features/support/bug-reports/constants/stats";

dotenv.config({ path: ".env.local" });

async function populateBugReportStats() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 Mongoose DB 연결 성공");

    // 1. 전체 요청(Request) 중 유형이 'BUG'인 것만 전수 조회
    const bugRequests = await RequestModel.find({
      type: REQUEST_TYPE.BUG_REPORT,
    }).lean();

    console.log("--------------------------------------------------");
    console.log(
      "📊 현재 DB에 저장된 총 BUG 유형 Request 개수:",
      bugRequests.length,
    );
    if (bugRequests.length > 0) {
      console.log("🔍 샘플 BUG 데이터 확인:", {
        id: bugRequests[0]._id,
        title: bugRequests[0].title,
        status: bugRequests[0].status,
      });
    }
    console.log("--------------------------------------------------");

    // 2. 상태별 순수 카운트 계산
    const total = bugRequests.length;

    const pending = bugRequests.filter(
      (req) => req.status === BUG_REPORT_STATUS.PENDING,
    ).length;
    const checking = bugRequests.filter(
      (req) => req.status === BUG_REPORT_STATUS.CHECKING,
    ).length;
    const fixing = bugRequests.filter(
      (req) => req.status === BUG_REPORT_STATUS.FIXING,
    ).length;
    const completed = bugRequests.filter(
      (req) => req.status === BUG_REPORT_STATUS.COMPLETED,
    ).length;

    console.log("🧮 집계 연산 완료:");
    console.log(`[Total]: ${total}개`);
    console.log(`┗ 접수대기(PENDING): ${pending}개`);
    console.log(`┗ 확인중(CHECKING): ${checking}개`);
    console.log(`┗ 수정중(FIXING): ${fixing}개`);
    console.log(`┗ 해결완료(COMPLETED): ${completed}개`);
    console.log("--------------------------------------------------");

    // 3. 통계 모델에 원자적 $set & upsert 단건 적재
    const updateResult = await BugReportStatsModel.updateOne(
      { key: BUG_REPORT_STATS_KEY },
      {
        $set: {
          key: BUG_REPORT_STATS_KEY,
          total,
          pending,
          checking,
          fixing,
          completed,
        },
      },
      { upsert: true },
    );

    console.log("💾 통계 스냅샷 반영 결과:", updateResult);

    // 4. 반영된 최종 도큐먼트 검증 조회
    const finalData = await BugReportStatsModel.findOne({
      key: BUG_REPORT_STATS_KEY,
    }).lean();

    console.log("✨ DB에 보관된 최종 마이그레이션 데이터:", finalData);
    console.log("--------------------------------------------------");

    console.log("🏁 버그 리포트 통계 동기화 스크립트 정상 종료");
    process.exit(0);
  } catch (error) {
    console.error("❌ 스크립트 실행 중 치명적 에러 발생:", error);
    process.exit(1);
  }
}

populateBugReportStats();
