import { UserKeywordModel } from "../models/UserKeyword";

export class UserKeywordRepository {
  async create(data: {
    userId: string;
    displayKeyword: string;
    keyword: string;
  }) {
    return UserKeywordModel.create(data);
  }

  async findByUserId(userId: string) {
    return UserKeywordModel.find({ userId });
  }

  async deactivate(id: string) {
    return UserKeywordModel.findByIdAndUpdate(id, {
      isActive: false,
    });
  }

  async findById(keywordId: string) {
    return UserKeywordModel.findById(keywordId).lean();
  }

  // 키워드 삭제
  async deleteById(userKeywordId: string) {
    return UserKeywordModel.deleteOne({ _id: userKeywordId });
  }

  async toggleActive(userKeywordId: string, isActive: boolean) {
    return UserKeywordModel.findByIdAndUpdate(
      userKeywordId,
      { isActive },
      { new: true },
    );
  }
}
