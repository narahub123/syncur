import { ClientSession, Types } from "mongoose";
import { InterestLean } from "../types/interest-leans";
import { InterestModel } from "../models/Interest";

export class InterestRepository {
  /**
   * 새로운 관심사 생성 (카테고리 존재 확인 포함)
   */
  // InterestRepository.ts
  async create(data: {
    slug: string;
    name: string;
    categoryId: string;
  }): Promise<InterestLean> {
    // 검증 로직 없음. 오직 DB 작업만!
    const doc = await InterestModel.create(data);
    return doc.toObject() as unknown as InterestLean;
  }

  /**
   * 모든 관심사 조회
   */
  async findAll(): Promise<InterestLean[]> {
    return await InterestModel.find().sort({ createdAt: -1 }).lean();
  }

  /**
   * 특정 카테고리에 속한 관심사 목록 조회
   */
  async findByCategoryId(categoryId: string): Promise<InterestLean[]> {
    return await InterestModel.find({
      categoryId: new Types.ObjectId(categoryId),
    })
      .sort({ name: 1 })
      .lean();
  }

  /**
   * ID로 단일 관심사 조회
   */
  async findById(id: string): Promise<InterestLean | null> {
    return await InterestModel.findById(new Types.ObjectId(id)).lean();
  }

  /**
   * 관심사 수정
   */
  async update(
    id: string,
    data: { slug?: string; name?: string; categoryId?: string },
  ): Promise<InterestLean | null> {
    return await InterestModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: data },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * 관심사 삭제
   */
  async delete(id: string): Promise<boolean> {
    const result = await InterestModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result.deletedCount > 0;
  }

  async incrementUserCount(
    ids: string[],
    session?: ClientSession,
  ): Promise<void> {
    await InterestModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { $inc: { userCount: 1 } },
      { session },
    );
  }

  async decrementUserCount(
    ids: string[],
    session?: ClientSession,
  ): Promise<void> {
    await InterestModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { $inc: { userCount: -1 } },
      { session },
    );
  }
}
