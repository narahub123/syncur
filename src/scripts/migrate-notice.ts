import { NOTICE_STATUS } from "@/features/admin/notices/types/search";
import { NoticeModel } from "@/features/support/notices/model/Notice";
import dotenv from "dotenv";
import mongoose from "mongoose";

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
    // 1. status 필드가 없는 모든 문서에 대해 ACTIVE 상태를 부여합니다.
    // $exists: false 조건을 사용하여 이미 status가 있는 데이터는 건드리지 않습니다.
    const result = await NoticeModel.updateMany(
      { status: { $exists: false } },
      { $set: { status: NOTICE_STATUS.ACTIVE } },
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
