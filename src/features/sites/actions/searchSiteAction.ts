"use server";

import { getSiteSubscriptionContext } from "@/features/sites/service/getSiteSubscriptionContext";
import { auth } from "@/auth";
import { SiteContextDTO } from "../dto/siteDto";
import { normalizeInputUrl } from "../utils/normalizeInputUrl";

/**
 * Site 검색 Server Action
 *
 * @description
 * 사용자가 입력한 query를 기반으로
 * DB에 존재하는 Site를 검색하고,
 * 해당 사이트에 대한 Subscription 상태까지 함께 포함한 Context 결과를 반환한다.
 *
 * 전체 흐름:
 * 1. auth()를 통해 사용자 인증 정보 조회
 * 2. query 유효성 검사
 * 3. Service 레이어에서 Site + Subscription Context 생성
 * 4. DTO 형태로 프론트에 안전하게 반환
 *
 * @important
 * - 이 레이어는 Orchestration 역할만 수행한다
 * - 비즈니스 로직(검색/판단)은 Service와 Domain으로 위임한다
 * - Mongoose Document(ObjectId 등)는 그대로 반환하면 안 된다
 * - 반드시 plain object(DTO)로 반환해야 한다
 *
 * @layer
 * Action (entry / orchestration layer)
 * - 인증 처리
 * - 입력 검증
 * - Service 호출
 * - 결과 반환
 *
 * @returns
 * SiteSubscriptionContextDTO[]
 */
export async function searchSiteAction(
  query: string,
): Promise<SiteContextDTO[]> {
  // 1. 입력값 검증: 빈 문자열이면 즉시 종료
  if (!query?.trim()) return [];

  const normalizedUrl = normalizeInputUrl(query);

  // 2. 인증 정보 조회
  const session = await auth();

  // 3. 인증 실패 처리
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    // 4. Service 호출:
    // Site 검색 + Subscription Context 생성 결과 반환
    return await getSiteSubscriptionContext(normalizedUrl, userId);
  } catch (error) {
    // 5. 안전한 fallback 처리
    console.error("[searchSiteAction]", error);
    return [];
  }
}
