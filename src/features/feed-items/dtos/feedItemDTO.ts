export type FeedItemDto = {
  _id: string;
  feedId: string;

  guid: string | null;

  title: string;
  description: string;
  author: string | null;

  link: string;

  categories: string[];

  publishedAt: string | null;

  createdAt: string;
  updatedAt: string;
};
