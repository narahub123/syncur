import { UserKeywordTargetModel } from "../models/UserKeywordTarget";

export class UserKeywordTargetRepository {
  async create(data: { userKeywordId: string; subscriptionId: string | null }) {
    return UserKeywordTargetModel.create(data);
  }

  async findByKeywordIds(userKeywordIds: string[]) {
    return UserKeywordTargetModel.find({
      userKeywordId: { $in: userKeywordIds },
    });
  }
}
