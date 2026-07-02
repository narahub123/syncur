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

  // 사용자의 키워드 목록 조회
  async getUserKeywords(userId: string) {
    const keywords = await userKeywordRepository.findByUserId(userId);

    const keywordIds = keywords.map((k) => k._id.toString());

    const targets = await userKeywordTargetService.findByKeywordIds(keywordIds);

    const targetMap = new Map<
      string,
      {
        subscriptionId: string;
        feedId: string;
        feedName: string;
      }[]
    >();

    for (const t of targets) {
      const key = t.userKeywordId.toString();

      if (!targetMap.has(key)) {
        targetMap.set(key, []);
      }

      // ALL 처리
      if (!t.subscriptionId) {
        targetMap.set(key, []);
        continue;
      }

      targetMap.get(key)!.push({
        subscriptionId: t.subscriptionId.toString(),
        feedId: t.feedId.toString(),
        feedName: t.feedName,
      });
    }

    return keywords.map((k) => ({
      userKeywordId: k._id.toString(),
      displayKeyword: k.displayKeyword,
      keyword: k.keyword,
      isActive: k.isActive,
      targets: targetMap.get(k._id.toString()) ?? [],
    }));
  }
}
