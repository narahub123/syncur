import dotenv from "dotenv";
import mongoose from "mongoose";
import { FaqModel } from "@/features/support/faqs/model/Faq";

dotenv.config({
  path: ".env.local",
});

const categoryMap: Record<string, string> = {
  "피드 관리": "payment",
  이용문의: "usage",
  버그신고: "bug",
  기타: "etc",
};

async function migrate() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const cursor = FaqModel.find({}).cursor();

  for await (const faq of cursor) {
    const nextCategory = categoryMap[faq.category];

    if (!nextCategory) {
      console.warn(`Unknown category: ${faq.category} (${faq._id.toString()})`);
      continue;
    }

    faq.category = nextCategory;
    await faq.save();
  }

  console.log("Migration completed");

  await mongoose.disconnect();
}

migrate().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
