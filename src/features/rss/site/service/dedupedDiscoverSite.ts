import { discoverSite, SiteDiscoveryResult } from "../../discovery";

// URL 기준으로 진행 중인 discovery를 저장
const inflightDiscoveryMap = new Map<string, Promise<SiteDiscoveryResult>>();

export async function dedupedDiscoverSite(url: string) {
  // 1. 이미 진행 중이면 그대로 재사용
  const existing = inflightDiscoveryMap.get(url);
  if (existing) {
    return existing;
  }

  // 2. 새 discovery 생성
  const promise = (async () => {
    try {
      return await discoverSite(url);
    } finally {
      // 3. 완료되면 무조건 제거 (메모리 누수 방지)
      inflightDiscoveryMap.delete(url);
    }
  })();

  // 4. 등록
  inflightDiscoveryMap.set(url, promise);

  return promise;
}
