export type Site = {
  _id: string;

  /**
   * 사용자가 구독한 원본 페이지 URL
   * 예) https://velog.io/@abc
   */
  url: string;

  /**
   * 사용자에게 표시할 이름
   */
  name: string;

  /**
   * 사이트 파비콘 URL
   */
  favicon_url: string | null;

  /**
   * 실제 수집에 사용하는 RSS/Atom Feed URL
   */
  feed_url: string | null;

  createdAt: Date;
  updatedAt: Date;
};
