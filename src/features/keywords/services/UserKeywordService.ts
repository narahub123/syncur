import { subscriptionService } from "@/features/subscriptions/services/SubscriptionService.instance";
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

    // 🔥 핵심: targets까지 포함해서 동일 구조 반환
    const targets = await userKeywordTargetService.findByKeywordIds([
      keyword._id.toString(),
    ]);

    const targetMap = new Map();

    for (const t of targets) {
      const key = t.userKeywordId.toString();

      if (!targetMap.has(key)) {
        targetMap.set(key, []);
      }

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

    return {
      userKeywordId: keyword._id.toString(),
      displayKeyword: keyword.displayKeyword,
      keyword: keyword.keyword,
      isActive: keyword.isActive,
      targets: targetMap.get(keyword._id.toString()) ?? [],
    };
  }

  // 단일 키워드 조회
  async getUserKeywordDetail(params: {
    userId: string;
    userKeywordId: string;
  }) {
    const keyword = await userKeywordRepository.findById(params.userKeywordId);

    if (!keyword) {
      throw new Error("KEYWORD_NOT_FOUND");
    }

    if (keyword.userId.toString() !== params.userId) {
      throw new Error("FORBIDDEN");
    }

    const targets = await userKeywordTargetService.findByKeywordId(
      params.userKeywordId,
    );

    const subscriptions = await subscriptionService.findByUserIdWithFeed(
      params.userId,
    );

    // 🔥 subscription map
    const subscriptionMap = new Map(
      subscriptions.map((s) => [s._id.toString(), s]),
    );

    const targetList = targets
      .map((t) => {
        if (!t.subscriptionId) return null;

        const sub = subscriptionMap.get(t.subscriptionId.toString());

        if (!sub) return null;

        return {
          subscriptionId: sub._id.toString(),
          feedId: sub.feedId.toString(),
          feedName: sub.feedName,
        };
      })
      .filter(Boolean);

    const subscriptionList = subscriptions.map((s) => ({
      subscriptionId: s._id.toString(),
      feedId: s.feedId.toString(),
      feedName: s.feedName,
    }));

    return {
      userKeywordId: keyword._id.toString(),
      displayKeyword: keyword.displayKeyword,
      keyword: keyword.keyword,
      isActive: keyword.isActive,
      targets: targetList,
      subscriptions: subscriptionList,
    };
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

  // 키워드 수정
  async updateKeyword(params: {
    userId: string;
    userKeywordId: string;
    displayKeyword: string;
    keyword: string;
    subscriptionIds: string[];
  }) {
    const keyword = await userKeywordRepository.findById(params.userKeywordId);

    if (!keyword) {
      throw new Error("KEYWORD_NOT_FOUND");
    }

    if (keyword.userId.toString() !== params.userId) {
      throw new Error("FORBIDDEN");
    }

    // 1) keyword 업데이트
    const updated = await userKeywordRepository.updateById(
      params.userKeywordId,
      {
        displayKeyword: params.displayKeyword,
        keyword: params.keyword,
      },
    );

    // 2) targets replace
    await userKeywordTargetService.deleteByKeywordId(params.userKeywordId);

    await userKeywordTargetService.createTargets({
      userKeywordId: params.userKeywordId,
      subscriptionIds: params.subscriptionIds,
    });

    // 3) DTO 변환 (핵심)
    return {
      userKeywordId: updated._id.toString(),
      userId: updated.userId.toString(),
      displayKeyword: updated.displayKeyword,
      keyword: updated.keyword,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  // 사용자 키워드 삭제
  async deleteUserKeyword(userId: string, userKeywordId: string) {
    const keyword = await userKeywordRepository.findById(userKeywordId);

    if (!keyword || keyword.userId.toString() !== userId) {
      throw new Error("NOT_FOUND");
    }

    await userKeywordTargetService.deleteByKeywordId(userKeywordId);

    await userKeywordRepository.deleteById(userKeywordId);
  }

  // 사용자 키워드 활성 비활성
  async toggleKeywordActive(params: {
    userId: string;
    userKeywordId: string;
    isActive: boolean;
  }) {
    const keyword = await userKeywordRepository.findById(params.userKeywordId);

    if (!keyword) {
      throw new Error("KEYWORD_NOT_FOUND");
    }

    // 소유권 체크 (중요)
    if (keyword.userId.toString() !== params.userId) {
      throw new Error("FORBIDDEN");
    }

    const updated = await userKeywordRepository.toggleActive(
      params.userKeywordId,
      params.isActive,
    );

    return {
      userKeywordId: updated!._id.toString(),
      isActive: updated!.isActive,
    };
  }
}
