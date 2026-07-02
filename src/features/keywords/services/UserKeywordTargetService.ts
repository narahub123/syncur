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

  async findByKeywordIds(userKeywordIds: string[]) {
    return userKeywordTargetRepository.findByKeywordIdsWithFeed(userKeywordIds);
  }
}
