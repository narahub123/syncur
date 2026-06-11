import User from "../features/users/models/User";
import { USER_ROLE } from "../features/users/constants/user-role";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });
/**
 * User role migration script
 *
 * - 기존 users 컬렉션에 role 필드가 없는 데이터에 기본값 주입
 * - MongoDBAdapter 사용 환경에서 안전하게 role 추가
 */
async function migrateUserRole() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  try {
    console.log("🔄 User role migration started...");

    const result = await User.updateMany(
      {
        role: { $exists: false },
      },
      {
        $set: {
          role: USER_ROLE.USER,
        },
      },
    );

    console.log("✅ Migration completed");
    console.log(`🧾 matched: ${result.matchedCount}`);
    console.log(`✏️ modified: ${result.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateUserRole();
