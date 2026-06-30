import axios from "axios";
import { Logger } from "../../logger/types";

/**
 * robots.txt 기반 크롤링 허용 여부 확인
 *
 * === 판단 기준 ===
 * - User-agent: * 섹션의 Disallow: / 여부
 * - fetch 실패 시 허용으로 간주 (robots.txt 없는 사이트 대응)
 *
 * === 주의 ===
 * - 경로별 세부 규칙은 현재 미지원 (전체 차단 여부만 확인)
 */
export class RobotsDetector {
  detect = async (baseUrl: string, logger: Logger): Promise<boolean> => {
    const domain = new URL(baseUrl).origin;
    const robotsUrl = `${domain}/robots.txt`;

    try {
      const res = await axios.get(robotsUrl, { timeout: 3000 });

      logger.info("robots.txt 조회 성공", { domain });

      const allowed = this.parse(res.data, logger);

      logger.info("robots.txt 파싱 완료", { domain, allowed });

      return allowed;
    } catch (e) {
      /**
       * fetch 실패 = robots.txt 없음으로 간주 → 허용
       */
      logger.warn("robots.txt 조회 실패 — 허용으로 간주", { domain });
      return true;
    }
  };

  /**
   * robots.txt 파싱
   *
   * User-agent: * 섹션에서 Disallow: / 가 있으면 전체 차단
   * 그 외는 허용으로 간주
   */
  private parse = (text: string, logger: Logger): boolean => {
    const lines = text.split("\n").map((l) => l.trim());

    let inWildcardSection = false;

    for (const line of lines) {
      /**
       * User-agent 섹션 진입 여부 추적
       */
      if (line.toLowerCase().startsWith("user-agent:")) {
        const agent = line.split(":")[1].trim();
        inWildcardSection = agent === "*";
        continue;
      }

      /**
       * User-agent: * 섹션에서 Disallow: / 발견 → 전체 차단
       */
      if (
        inWildcardSection &&
        line.toLowerCase().startsWith("disallow:") &&
        line.split(":")[1].trim() === "/"
      ) {
        logger.info("robots.txt — 전체 크롤링 차단 감지");
        return false;
      }
    }

    return true;
  };
}

export const robotsDetector = new RobotsDetector();
