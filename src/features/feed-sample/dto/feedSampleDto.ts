export interface FeedSampleDto {
  _id: string;

  feedId: string;

  sourceType: "rss" | "crawler";

  link: string;
  title: string;

  description?: string;
  author?: string;

  publishedAt?: string;

  categories: string[];

  status: "valid" | "invalid";

  error?: string;

  hash: string;

  createdAt: string;
  updatedAt: string;
}
