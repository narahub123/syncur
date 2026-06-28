import mongoose from "mongoose";
import dotenv from "dotenv";
import { SiteModel } from "@/features/rss/site/model/Site";
import { SITE_FEED_STATUS } from "@/features/rss/site/constants/site";

dotenv.config({
  path: ".env.local",
});

async function migrate() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB...");

  try {
    /**
     * 1. feedStatus 필드가 없는 모든 Site를 RSS로 초기화
     *
     * - 기존 데이터 = 모두 RSS 가능 상태
     * - 따라서 전부 rss로 세팅
     * - 이미 feedStatus 있는 데이터는 건드리지 않음
     */
    const result = await SiteModel.updateMany(
      { feedStatus: { $exists: false } },
      {
        $set: {
          feedStatus: SITE_FEED_STATUS.RSS,
        },
      },
    );

    console.log(
      `Migration completed: ${result.modifiedCount} documents updated.`,
    );
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
