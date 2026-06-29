export interface FeedItemInput {
  guid?: string | null; // 추가
  link: string;
  title: string;
  description?: string;
  author?: string | null;
  publishedAt?: string | Date | null;
  categories?: string[];
}
