import mongoose from "mongoose";
import dotenv from "dotenv";
import { INQUIRY_STATUS } from "@/features/admin/inquiries/types/search"; // Inquiry 상태 상수
import { RequestModel } from "@/features/support/requests/model/Request";
import { REQUEST_TYPE } from "@/features/support/requests/constants/request-type";
import { InquiryStatsModel } from "@/features/support/inquiries/model/InquiryStats"; // 🎯 경로 확인
import { INQUIRY_STATS_KEY } from "@/features/support/inquiries/constants/stats"; // "inquiry_overview" 상수

dotenv.config({ path: ".env.local" });

async function populateInquiryStats() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 Mongoose DB 연결 성공 (Inquiry Stats)");

    // 1. 전체 요청(Request) 중 유형이 'INQUIRY'인 것만 전수 조회
    const inquiryRequests = await RequestModel.find({
      type: REQUEST_TYPE.INQUIRY, // 🎯 REQUEST_TYPE 상수 사용
    }).lean();

    console.log("--------------------------------------------------");
    console.log(
      "📊 현재 DB에 저장된 총 INQUIRY 유형 Request 개수:",
      inquiryRequests.length,
    );
    if (inquiryRequests.length > 0) {
      console.log("🔍 샘플 INQUIRY 데이터 확인:", {
        id: inquiryRequests[0]._id,
        title: inquiryRequests[0].title,
        status: inquiryRequests[0].status,
      });
    }
    console.log("--------------------------------------------------");

    // 2. 상태별 순수 카운트 계산
    const total = inquiryRequests.length;

    const pending = inquiryRequests.filter(
      (req) => req.status === INQUIRY_STATUS.PENDING,
    ).length;
    const processing = inquiryRequests.filter(
      (req) => req.status === INQUIRY_STATUS.PROCESSING,
    ).length;
    const completed = inquiryRequests.filter(
      (req) => req.status === INQUIRY_STATUS.COMPLETED,
    ).length;

    console.log("🧮 집계 연산 완료:");
    console.log(`[Total]: ${total}개`);
    console.log(`┗ 대기중(PENDING): ${pending}개`);
    console.log(`┗ 처리중(PROCESSING): ${processing}개`);
    console.log(`┗ 답변완료(COMPLETED): ${completed}개`);
    console.log("--------------------------------------------------");

    // 3. 통계 모델에 원자적 $set & upsert 단건 적재
    const updateResult = await InquiryStatsModel.updateOne(
      { key: INQUIRY_STATS_KEY },
      {
        $set: {
          key: INQUIRY_STATS_KEY,
          total,
          pending,
          processing,
          completed,
        },
      },
      { upsert: true },
    );

    console.log("💾 통계 스냅샷 반영 결과:", updateResult);

    // 4. 반영된 최종 도큐먼트 검증 조회
    const finalData = await InquiryStatsModel.findOne({
      key: INQUIRY_STATS_KEY,
    }).lean();

    console.log("✨ DB에 보관된 최종 마이그레이션 데이터:", finalData);
    console.log("--------------------------------------------------");

    console.log("🏁 Inquiry 통계 동기화 스크립트 정상 종료");
    process.exit(0);
  } catch (error) {
    console.error("❌ 스크립트 실행 중 치명적 에러 발생:", error);
    process.exit(1);
  }
}

populateInquiryStats();
