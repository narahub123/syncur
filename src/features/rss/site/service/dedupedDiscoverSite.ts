import { discoverSite, SiteDiscoveryResult } from "../../discovery";

// URL별 진행 중인 discovery 작업을 캐싱
// 동일 URL에 대한 중복 탐색 요청을 방지하기 위해 사용
const inflightDiscoveryMap = new Map<string, Promise<SiteDiscoveryResult>>();

export async function dedupedDiscoverSite(url: string) {
  /**
   * 1. 이미 동일 URL에 대한 discovery가 진행 중이면
   * 기존 Promise를 그대로 반환
   *
   * 예:
   * A 요청 -> discover 시작
   * B 요청 -> 기존 Promise 재사용
   * => 외부 사이트 요청 1회만 수행
   */
  const existing = inflightDiscoveryMap.get(url);

  if (existing) {
    return existing;
  }

  /**
   * 2. 진행 중인 작업이 없으면 새 discovery 시작
   */
  const promise = (async () => {
    try {
      return await discoverSite(url);
    } finally {
      /**
       * 3. 성공/실패 여부와 관계없이
       * 작업 완료 후 캐시 제거
       *
       * - 다음 요청은 다시 discovery 가능
       * - 메모리 누수 방지
       * - 실패한 Promise가 계속 재사용되는 것 방지
       */
      inflightDiscoveryMap.delete(url);
    }
  })();

  /**
   * 4. 다른 요청이 재사용할 수 있도록
   * 진행 중인 Promise 등록
   */
  inflightDiscoveryMap.set(url, promise);

  return promise;
}
