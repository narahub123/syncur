import { AdminUserSort, AdminUsersQuery } from "../types/search";
import { UserLeanPaagedResponse } from "@/features/users/dto/userDto";
import { UserLean } from "@/features/users/types/lean";
import User from "@/features/users/models/User";

export class AdminUserRepository {
  async findAllPaginated(
    params: AdminUsersQuery,
  ): Promise<UserLeanPaagedResponse> {
    const { page, limit, search, searchField, sort, sortOrder, filters } =
      params;

    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    const matchStage: Record<string, unknown> = {};

    // role
    const roleFilter = filters?.role;

    if (Array.isArray(roleFilter)) {
      if (!roleFilter.includes("all")) {
        matchStage.role = { $in: roleFilter };
      }
    }

    // onboarding
    const onboardingFilter = filters?.onboarding;

    if (Array.isArray(onboardingFilter)) {
      if (!onboardingFilter.includes("all")) {
        matchStage.onboarding = { $in: onboardingFilter };
      }
    }

    // createdAt
    if (
      filters.createdAt &&
      typeof filters.createdAt === "object" &&
      ("start" in filters.createdAt || "end" in filters.createdAt)
    ) {
      const { start, end } = filters.createdAt as {
        start: Date | null;
        end: Date | null;
      };

      const dateQuery: Record<string, Date> = {};

      if (start) {
        dateQuery.$gte = start;
      }

      if (end) {
        dateQuery.$lte = end;
      }

      if (Object.keys(dateQuery).length > 0) {
        matchStage.createdAt = dateQuery;
      }
    }

    /**
     * =========================
     * SEARCH
     * =========================
     */
    if (search && search.trim().length > 0) {
      const keyword = search.trim();

      if (searchField === "name") {
        matchStage.name = { $regex: keyword, $options: "i" };
      }

      if (searchField === "email") {
        matchStage.email = { $regex: keyword, $options: "i" };
      }
    }

    /**
     * =========================
     * SORT MAP
     * =========================
     */
    const sortMap: Record<AdminUserSort, Record<string, 1 | -1>> = {
      name: { name: mongoOrder },
      email: { email: mongoOrder },
      role: { role: mongoOrder },
      onboarding: { onboardingCompleted: mongoOrder },
      createdAt: { createdAt: mongoOrder },
    };

    const [items, totalCount] = await Promise.all([
      User.find(matchStage)
        .sort(sortMap[sort])
        .skip(skip)
        .limit(limit)
        .lean<UserLean[]>()
        .exec(),

      User.countDocuments(matchStage),
    ]);

    return {
      items,
      totalCount,
    };
  }

  async countAllUsers(): Promise<number> {
    return await User.countDocuments();
  }

  /**
   * ID로 사용자 조회
   *
   * @param userId 사용자 ObjectId
   * @returns UserLean | null
   */
  async findById(userId: string): Promise<UserLean | null> {
    return User.findById(userId).lean<UserLean>().exec();
  }
}
