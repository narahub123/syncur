/** 목록 페이지 후보 정보를 담는 인터페이스 */
export interface ListingPageCandidate {
  url: string;
  title: string;
  lastUpdated: string | null;
  score: number;
  reason: string[];
}

/** 분석 결과 정보를 담는 인터페이스 */
export interface ListingDetectionResult {
  candidates: ListingPageCandidate[];
  fromCache: boolean;
}
