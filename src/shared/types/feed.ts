export type FeedItem = {
  _id: string;

  feedId: string;

  guid?: string | null;

  link: string;

  title: string;

  description?: string | null;

  content?: string | null;

  author?: string | null;

  publishedAt?: Date | null;

  categories: string[];

  hash: string;

  createdAt: Date;
  updatedAt: Date;
};

export type FeedStauts = "active" | "disabled";

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
