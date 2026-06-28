export interface FeedItemInput {
  link: string;
  title: string;

  description?: string;
  author?: string;

  publishedAt?: string | Date;

  categories?: string[];
}
