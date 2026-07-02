export interface KeywordItemDto {
  userKeywordId: string;
  displayKeyword: string;
  keyword: string;
  isActive: boolean;
  targets: KeywordItemTarget[];
}

export interface KeywordItemTarget {
  subscriptionId: string;
  feedId: string;
  feedName: string;
}
