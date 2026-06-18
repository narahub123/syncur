import { Schema, model, models } from "mongoose";

/**
 * Site MongoDB Document
 *
 * Site 컬렉션에 저장되는 문서 타입.
 */
export interface SiteDocument {
  /**
   * 사용자가 구독한 원본 페이지 URL
   *
   * 예:
   * https://velog.io/@abc
   * https://openai.com/news
   *
   * URL 정규화 후 저장
   */
  url: string;

  /**
   * 사용자에게 표시할 Feed 이름
   *
   * 추출 우선순위:
   * 1. RSS title
   * 2. HTML title
   * 3. hostname
   */
  name: string;

  /**
   * 사이트 파비콘 URL
   *
   * 예:
   * https://velog.io/favicon.ico
   */
  favicon_url: string | null;

  /**
   * 실제 수집에 사용하는 RSS/Atom Feed URL
   *
   * 예:
   * https://v2.velog.io/rss/abc
   * https://openai.com/news/rss.xml
   *
   * RSS를 찾지 못한 경우 null
   */
  feed_url: string | null;
}

const siteSchema = new Schema<SiteDocument>(
  {
    /**
     * 사용자가 구독한 원본 페이지 URL
     *
     * 예:
     * https://velog.io/@abc
     * https://openai.com/news
     *
     * URL 정규화 후 저장
     */
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /**
     * 사용자에게 표시할 Feed 이름
     *
     * 추출 우선순위:
     * 1. RSS title
     * 2. HTML title
     * 3. hostname
     */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * 사이트 파비콘 URL
     *
     * 예:
     * https://velog.io/favicon.ico
     */
    favicon_url: {
      type: String,
      default: null,
      trim: true,
    },

    /**
     * 실제 수집에 사용하는 RSS/Atom Feed URL
     *
     * 예:
     * https://v2.velog.io/rss/abc
     * https://openai.com/news/rss.xml
     *
     * RSS를 찾지 못한 경우 null
     */
    feed_url: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SiteModel = models.Site || model<SiteDocument>("Site", siteSchema);
