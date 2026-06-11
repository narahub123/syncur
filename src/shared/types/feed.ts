export type FeedItem = {
  _id: string;

  feedId: string;

  guid?: string | null;

  link: string;

  title: string;

  description: string;

  author?: string | null;

  publishedAt: string | null;

  categories: string[];

  hash: string;

  createdAt: Date;
  updatedAt: Date;
};

export type FeedStatus = "active" | "disabled";

export type Feed = {
  id: string;
  siteId: string;
  feedUrl: string;

  status: FeedStatus;

  errorCount: number;

  categories: string[];

  lastFetchedAt?: string;
  etag: string | null;
  lastModified: string | null;
};
