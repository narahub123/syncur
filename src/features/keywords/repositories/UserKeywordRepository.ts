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
    return UserKeywordModel.find({ userId, isActive: true });
  }

  async deactivate(id: string) {
    return UserKeywordModel.findByIdAndUpdate(id, {
      isActive: false,
    });
  }
}
