export type SiteDto = {
  _id: string;
  url: string;
  name: string;
  favicon_url: string | null;
  feed_url: string | null;
};

export type FeedItemMetaDto = {
  site: SiteDto;
  publishedAt: string;
  feedItemId: string;
};

export type FeedItemContentDto = {
  _id: string;
  title: string;
  description: string;
  link: string;
};

export type FeedItemResponse = {
  meta: FeedItemMetaDto;
  content: FeedItemContentDto;
  categories: string[];
};
