import { AdminDashboardStatsModel } from "@/features/admin/dashboard/model/AdminDashboardStats";
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

// =========================================================================
// 🛠️ AdminDashboardStats 동기화를 위한 Mongoose 미들웨어 (Hooks)
// =========================================================================

/**
 * 1️⃣ SiteRepository.create() 실행 시 작동하는 후처리 미들웨어
 * - 신규 문서가 단건 저장될 때 대시보드의 전체 카운트를 원자적으로 올려줍니다.
 */
siteSchema.post("save", async function (doc) {
  const isCanRss = doc.feed_url !== null;

  await AdminDashboardStatsModel.updateOne(
    { key: "dashboard_overview" },
    {
      $inc: {
        "sites.total": 1,
        "sites.canRss": isCanRss ? 1 : 0,
        "sites.noRss": isCanRss ? 0 : 1,
      },
    },
    { upsert: true },
  );
});

/**
 * 2️⃣ SiteRepository.upsert() 실행 시 작동하는 후처리 미들웨어 (findOneAndUpdate 대응)
 * - upsert는 문서가 새로 생성될 수도 있고, 기존 문서가 수정될 수도 있어 복잡합니다.
 * - 이 경우 수치를 수동 계산하는 것보다, 원본 Site 컬렉션의 실제 도큐먼트 개수를
 * 정확하게 긁어와서 대시보드 스냅샷에 덮어씌워버리는($set) 방식이 정합성 측면에서 100% 안전합니다.
 */
siteSchema.post("findOneAndUpdate", async function () {
  try {
    // 현재 Site 컬렉션의 전체 수치 직접 집계 (Model을 직접 호출하기 위해 this.model 사용)
    const total = await this.model.countDocuments();
    const canRss = await this.model.countDocuments({ feed_url: { $ne: null } });
    const noRss = total - canRss;

    // 대시보드 통계판 최신화
    await AdminDashboardStatsModel.updateOne(
      { key: "dashboard_overview" },
      {
        $set: {
          "sites.total": total,
          "sites.canRss": canRss,
          "sites.noRss": noRss,
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

// =========================================================================

export const SiteModel = models.Site || model<SiteDocument>("Site", siteSchema);
