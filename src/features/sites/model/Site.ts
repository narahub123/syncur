import { AdminDashboardStatsModel } from "@/features/admin/dashboard/model/AdminDashboardStats";
import { Schema, model, models } from "mongoose";
import { SiteFeedStatus } from "../types";
import { SITE_FEED_STATUS } from "../constants/site";

export interface SiteDocument {
  /**
   * 사용자가 구독한 원본 페이지 URL
   *
   * URL 정규화 후 저장
   */
  url: string;

  /**
   * 사용자에게 표시할 사이트 이름
   *
   * 추출 우선순위:
   * 1. RSS title
   * 2. HTML title
   * 3. hostname
   */
  name: string;

  /**
   * 사이트 파비콘 URL
   */
  favicon_url: string | null;

  /**
   * 피드 가능 여부
   *
   * - rss: RSS/Atom 피드 가능
   * - crawlable: RSS 없지만 목록 페이지 크롤링 가능
   * - unavailable: 둘 다 불가능
   *
   * 재검색 시 DB에서 바로 확인 가능
   */
  feedStatus: SiteFeedStatus;
}

const siteSchema = new Schema<SiteDocument>(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    favicon_url: {
      type: String,
      default: null,
      trim: true,
    },

    feedStatus: {
      type: String,
      enum: Object.values(SITE_FEED_STATUS),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// =====================
// AdminDashboardStats 동기화 미들웨어
// =====================

siteSchema.post("save", async function () {
  await AdminDashboardStatsModel.updateOne(
    { key: "dashboard_overview" },
    {
      $inc: {
        "sites.total": 1,
      },
    },
    { upsert: true },
  );
});

siteSchema.post("findOneAndUpdate", async function () {
  try {
    const total = await this.model.countDocuments();

    await AdminDashboardStatsModel.updateOne(
      { key: "dashboard_overview" },
      {
        $set: {
          "sites.total": total,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    console.error(
      "대시보드 사이트 통계 동기화 실패 (findOneAndUpdate):",
      error,
    );
  }
});

export const SiteModel = models.Site || model<SiteDocument>("Site", siteSchema);
