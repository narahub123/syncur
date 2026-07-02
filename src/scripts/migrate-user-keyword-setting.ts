import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "@/features/users/models/User";
import { FEED_FILTER } from "@/features/keywords/constants/feed-filter";
import { NOTIFY_FILTER } from "@/features/keywords/constants/notify-filter";
import { UserKeywordSettingModel } from "@/features/keywords/models/UserKeywordSetting";

dotenv.config({ path: ".env.local" });

async function migrate() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  console.log("⏳ MongoDB 연결 중...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB 연결 성공");

  console.log("⚙️ UserKeywordSetting 마이그레이션 시작...");

  const users = await User.find({}, { _id: 1 }).lean();

  if (!users.length) {
    console.log("ℹ️ 대상 유저 없음");
    process.exit(0);
  }

  const bulkOps = users.map((user) => ({
    updateOne: {
      filter: { userId: user._id },
      update: {
        $setOnInsert: {
          userId: user._id,
          defaultFeedFilter: FEED_FILTER.ALL,
          defaultNotifyFilter: NOTIFY_FILTER.ALL,
        },
      },
      upsert: true,
    },
  }));

  await UserKeywordSettingModel.bulkWrite(bulkOps);

  console.log(
    `🎉 UserKeywordSetting 마이그레이션 완료 (${users.length} users)`,
  );

  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ 마이그레이션 실패:", err);
  process.exit(1);
});
