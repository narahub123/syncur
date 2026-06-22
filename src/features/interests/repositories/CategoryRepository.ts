import { ClientSession, Types } from "mongoose";
import { CategoryLean } from "../types/category-leans";
import { CategoryModel } from "../models/Category";
import { InterestLean } from "../types/interest-leans";

export class CategoryRepository {
  /**
   * 새로운 카테고리 생성
   */
  async create(data: { slug: string; name: string }): Promise<CategoryLean> {
    const doc = await CategoryModel.create(data);

    return doc.toObject() as unknown as CategoryLean;
  }

  /**
   * 모든 카테고리 조회
   */
  async findAll(): Promise<CategoryLean[]> {
    return await CategoryModel.find().sort({ createdAt: -1 }).lean();
  }

  /**
   * ID로 단일 카테고리 조회
   */
  async findById(id: string): Promise<CategoryLean | null> {
    return await CategoryModel.findById(new Types.ObjectId(id)).lean();
  }

  /**
   * 카테고리 수정
   */
  async update(
    id: string,
    data: { slug?: string; name?: string },
  ): Promise<CategoryLean | null> {
    return await CategoryModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: data },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * 카테고리 삭제
   */
  async delete(id: string, session?: ClientSession): Promise<boolean> {
    const result = await CategoryModel.deleteOne(
      { _id: new Types.ObjectId(id) },
      { session }, // 세션 전달
    );
    return result.deletedCount > 0;
  }

  async incrementUserCount(
    ids: string[],
    session?: ClientSession,
  ): Promise<void> {
    // 옵션을 명확히 하나로 합침
    const options = session ? { session } : {};
    await CategoryModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { $inc: { userCount: 1 } },
      options,
    );
  }

  async decrementUserCount(
    ids: string[],
    session?: ClientSession,
  ): Promise<void> {
    const options = session ? { session } : {};
    await CategoryModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { $inc: { userCount: -1 } },
      options,
    );
  }

  async findAllWithInterests(): Promise<
    (CategoryLean & { interests: InterestLean[] })[]
  > {
    return await CategoryModel.aggregate([
      {
        $lookup: {
          from: "interests", // 실제 MongoDB 컬렉션 이름
          localField: "_id",
          foreignField: "categoryId",
          as: "interests",
        },
      },
      { $sort: { createdAt: 1 } },
    ]).exec();
  }
}
