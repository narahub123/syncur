/** 목록 페이지 후보 정보를 담는 인터페이스 */
export interface ListingPageCandidate {
  url: string;
  title: string;
  lastUpdated: string | null;
  score: number;
  reason: string[];

  listingPageConfig: ListingPageConfig | null;
  detailPageConfig: DetailPageConfig | null;
}

/** 분석 결과 정보를 담는 인터페이스 */
export interface ListingDetectionResult {
  candidates: ListingPageCandidate[];
  fromCache: boolean;
}

interface SiteParserConfig {
  listing: ListingPageConfig;
  detail: DetailPageConfig;
}

export interface FieldExtractor {
  selector: string;
  extract: "text" | "attr";
  attr?: string;
}

export interface ListingPageConfig {
  itemSelector: string;
  fields: {
    title: FieldExtractor;
    link: FieldExtractor;
    publishedAt: FieldExtractor | null;
  };
  pagination: {
    nextPageSelector: string | null;
  };
}

export interface DetailPageConfig {
  title: FieldExtractor;
  description: FieldExtractor | null;
  author: FieldExtractor | null;
  publishedAt: FieldExtractor | null;
  categories: FieldExtractor | null;
}
