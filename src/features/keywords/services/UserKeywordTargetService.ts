import { userKeywordTargetRepository } from "../repositories/UserKeywordTargetRepository.instance";

export class UserKeywordTargetService {
  async createTargets(params: {
    userKeywordId: string;
    subscriptionIds: string[];
  }) {
    if (params.subscriptionIds.length === 0) {
      return userKeywordTargetRepository.create({
        userKeywordId: params.userKeywordId,
        subscriptionId: null,
      });
    }

    return Promise.all(
      params.subscriptionIds.map((subscriptionId) =>
        userKeywordTargetRepository.create({
          userKeywordId: params.userKeywordId,
          subscriptionId,
        }),
      ),
    );
  }

  async findByKeywordId(userKeywordId: string) {
    return userKeywordTargetRepository.findByKeywordId(userKeywordId);
  }

  async findByKeywordIds(userKeywordIds: string[]) {
    return userKeywordTargetRepository.findByKeywordIdsWithFeed(userKeywordIds);
  }

  async deleteByKeywordId(userKeywordId: string) {
    return await userKeywordTargetRepository.deleteByKeywordId(userKeywordId);
  }
}
