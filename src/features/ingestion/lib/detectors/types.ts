import { JSDOM } from "jsdom";

// 1. 객체 상수 정의 (as const를 사용하여 리터럴 타입으로 고정)
export const SOURCE_TYPE = {
  RSS: "RSS",
  HTML: "HTML",
  API: "API",
  BROWSER: "BROWSER",
} as const;

// 2. 객체로부터 타입을 추출
export type SourceType = (typeof SOURCE_TYPE)[keyof typeof SOURCE_TYPE];

export type DetectionResult =
  | {
      type: typeof SOURCE_TYPE.RSS;
      rssUrl: string;
    }
  | {
      type: typeof SOURCE_TYPE.HTML;
    }
  | {
      type: typeof SOURCE_TYPE.API;
      endpoint: string[];
    }
  | {
      type: typeof SOURCE_TYPE.BROWSER;
    };

export interface SourceDetector {
  detect(dom: JSDOM, url: string): Promise<DetectionResult | null>;
}

export const HTML_SITE_TYPE = {
  STATIC: "STATIC",
  DYNAMIC: "DYNAMIC",
  UNKNOWN: "UNKNOWN",
} as const;

export type HtmlSiteType = (typeof HTML_SITE_TYPE)[keyof typeof HTML_SITE_TYPE];

export interface HtmlSiteDetector {
  detect(dom: JSDOM): HtmlSiteType;
}
