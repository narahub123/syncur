import { userKeywordRepository } from "../repositories/UserKeywordRepository.instance";
import { userKeywordTargetService } from "./UserKeywordTargetService.instance";

export class UserKeywordService {
  async createKeyword(params: {
    userId: string;
    displayKeyword: string;
    keyword: string;
    subscriptionIds?: string[];
  }) {
    const keyword = await userKeywordRepository.create({
      userId: params.userId,
      displayKeyword: params.displayKeyword,
      keyword: params.keyword,
    });

    await userKeywordTargetService.createTargets({
      userKeywordId: keyword._id.toString(),
      subscriptionIds: params.subscriptionIds ?? [],
    });

    return keyword;
  }
}
