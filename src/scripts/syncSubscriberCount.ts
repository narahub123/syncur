import dotenv from "dotenv";
import mongoose from "mongoose";
import { FeedModel } from "../features/feeds/model/feed"; // 실제 경로 확인
import { SubscriptionModel } from "../features/subscriptions/model/Subscription";

dotenv.config({ path: ".env.local" });

async function syncSubscriberCount() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB...");

  try {
    // 1. 모든 피드의 구독자 수를 0으로 초기화 (정합성 보장)
    console.log("Resetting all subscriber counts to 0...");
    await FeedModel.updateMany({}, { $set: { subscriberCount: 0 } });

    // 2. Subscription 컬렉션에서 피드별 구독자 수 집계
    console.log("Aggregating subscription counts...");
    const stats = await SubscriptionModel.aggregate([
      {
        $group: {
          _id: "$feedId",
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. 집계된 결과를 바탕으로 Feed 컬렉션 업데이트
    console.log(`Updating ${stats.length} feeds...`);

    // BulkWrite를 사용하여 성능 최적화
    const bulkOps = stats.map((stat) => ({
      updateOne: {
        filter: { _id: stat._id },
        update: { $set: { subscriberCount: stat.count } },
      },
    }));

    if (bulkOps.length > 0) {
      await FeedModel.bulkWrite(bulkOps);
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

syncSubscriberCount().catch((err) => {
  console.error(err);
  process.exit(1);
});
