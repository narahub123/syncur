export type FeedItem = {
  /**
   * 글 제목
   * - RSS / Atom title 통합
   * - HTML entity 제거된 정제된 값
   */
  title: string;

  /**
   * 원문 링크
   * - 클릭 이동용 canonical URL
   * - 상대경로 → 절대경로 변환 필수
   */
  link: string;

  /**
   * 게시 날짜
   * - RSS: pubDate
   * - Atom: published / updated
   * - 없으면 undefined
   */
  publishedAt?: Date;

  /**
   * 선택 정보 (확장용)
   * - content snippet
   * - summary
   * - description
   */
  summary?: string;

  /**
   * source feed URL
   * - 어떤 feed에서 왔는지 추적용
   */
  sourceFeedUrl?: string;
};

export type FeedStauts = "active" | "error" | "disabled";

export type Feed = {
  id: string;
  siteId: string;
  feedUrl: string;

  status: FeedStauts;

  errorCount: number;

  categories: string[];

  lastFetchedAt?: string;
  etag?: string;
  lastModified?: string;
};
