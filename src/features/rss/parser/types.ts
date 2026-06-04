export type RawRssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  published?: string;
  date?: string;
};

export type RawAtomLink =
  | string
  | {
      $?: {
        href?: string;
      };
    };

export type RawAtomEntry = {
  title?: string;
  link?: RawAtomLink | RawAtomLink[];
  updated?: string;
  published?: string;
  date?: string;
};
