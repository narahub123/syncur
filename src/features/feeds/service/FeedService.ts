import { Site } from "@/shared/types/site";
import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed } from "@/shared/types/feed";

export class FeedService {
  /**
   * Site → Feed 보장
   *
   * - site.feed_url 기반으로 Feed 존재 여부 확인
   * - 없으면 생성
   * - 있으면 그대로 반환
   *
   * NOTE:
   * - idempotent 보장 필수
   */
  async ensureFeed(site: Site): Promise<Feed | null> {
    // RSS 없는 site는 feed 생성 불가
    if (!site?.feed_url) {
      return null;
    }

    // 1. 기존 Feed 조회
    let feed = await feedRepository.findBySiteId(site._id);

    // 2. 없으면 생성
    if (!feed) {
      feed = await feedRepository.create({
        siteId: site._id.toString(),
        feedUrl: site.feed_url,
        status: "active",
        errorCount: 0,
        categories: [],
      });
    }

    return feed;
  }
}
