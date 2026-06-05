import { Schema, model, models } from "mongoose";
import { Site } from "@/shared/types/site";

const siteSchema = new Schema<Site>(
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
    timestamps: {
      /**
       * Site 생성 시각
       */
      createdAt: "created_at",

      /**
       * Site 정보 수정 시각
       */
      updatedAt: "updated_at",
    },
    versionKey: false,
  },
);

export const SiteModel = models.Site || model<Site>("Site", siteSchema);
