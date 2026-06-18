import dotenv from "dotenv";
import mongoose from "mongoose";
import { FeedExecutionLogModel } from "@/features/feed-execution-logs/model/feed-execution-log";

dotenv.config({
  path: ".env.local",
});

async function migrate() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  FeedExecutionLogModel.find({}).cursor();

  console.log("Migration completed");
  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
