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

  /**
   * 조건부 관심사 목록 조회 (카테고리 필터링 + 키워드 검색)
   */
  async findFiltered(filter: {
    categoryId?: string;
    keyword?: string;
  }): Promise<InterestLean[]> {
    const query: Record<string, unknown> = {};

    if (filter.categoryId) {
      query.categoryId = new Types.ObjectId(filter.categoryId);
    }

    if (filter.keyword) {
      // name 필드를 정규표현식으로 부분 일치 검색 (대소문자 무시)
      query.name = { $regex: filter.keyword, $options: "i" };
    }

    return (await InterestModel.find(query)
      .sort({ name: 1 })
      .lean()) as InterestLean[];
  }

  /**
   * Slug로 관심사 조회 (중복 검사 및 상세 조회용)
   */
  async findBySlug(slug: string): Promise<InterestLean | null> {
    return await InterestModel.findOne({ slug }).lean();
  }

  /**
   * 관심사 한 개 삭제
   */
  async delete(id: string, session?: ClientSession): Promise<boolean> {
    const result = await InterestModel.deleteOne(
      { _id: new Types.ObjectId(id) },
      { session }, // 세션 전달
    );
    return result.deletedCount > 0;
  }

  /**
   * 카테고리 ID로 관심사 일괄 삭제
   */
  async deleteManyByCategoryId(
    categoryId: string,
    session?: ClientSession,
  ): Promise<number> {
    const result = await InterestModel.deleteMany(
      { categoryId: new Types.ObjectId(categoryId) },
      { session }, // 세션 전달
    );
    return result.deletedCount;
  }
}
