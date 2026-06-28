/**
 * RSS 파싱 결과를 내부 RSS 입력 포맷으로 정규화합니다.
 *
 * @description
 * rss-parser로부터 나온 RSS 아이템 구조는 라이브러리마다 필드가 다를 수 있기 때문에,
 * 시스템 내부에서 사용하는 "표준 RSS 입력 포맷"으로 통일하는 역할을 합니다.
 *
 * 이 단계는 crawler / dynamic / rss 간 데이터 구조를 동일하게 맞추기 위한 핵심 변환 단계입니다.
 */
export function normalizeToRssInput(
  rssFeed: {
    guid: string | null;
    link: string;
    title: string;
    description: string;
    author: string | null;
    publishedAt: Date;
    categories: string[];
    hash: string;
  }[],
) {
  return {
    items: rssFeed.map((item) => ({
      // =========================
      // [1. 기본 콘텐츠 필드 매핑]
      // =========================
      link: item.link,
      title: item.title,
      description: item.description,

      // RSS 파서 구조 호환용 필드 (crawler/dynamic과 통일)
      content: item.description,
      contentSnippet: item.description,

      // =========================
      // [2. 작성자 정보 정규화]
      // =========================
      // null → undefined로 통일 (RSS 라이브러리 차이 흡수)
      creator: item.author ?? undefined,
      author: item.author ?? undefined,

      // =========================
      // [3. 날짜 포맷 통일]
      // =========================
      // Date → ISO string 변환 (RSS 표준 형태로 통일)
      pubDate: item.publishedAt ? item.publishedAt.toISOString() : undefined,
      isoDate: item.publishedAt ? item.publishedAt.toISOString() : undefined,

      // =========================
      // [4. 카테고리 정규화]
      // =========================
      categories: item.categories ?? [],
    })),
  };
}
