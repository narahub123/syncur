import { SiteDiscoveryResult } from "../discovery/types";

/**
 * L1: memory cache
 * - 빠르지만 휘발성
 */
const memoryCache = new Map<
  string,
  {
    value: SiteDiscoveryResult;
    expiresAt: number;
  }
>();

/**
 * L2: persistent cache (DB or Redis abstraction)
 * - 실제 운영 캐시
 */
const persistentCache = new Map<string, SiteDiscoveryResult>();

/**
 * TTL 설정
 */
const TTL = {
  SITE: 1000 * 60 * 60 * 24 * 7, // 7 days
};

/**
 * 캐시 조회
 */
export async function getSiteCache(
  key: string,
): Promise<SiteDiscoveryResult | null> {
  /**
   * 1. L1 cache check
   */
  const mem = memoryCache.get(key);
  if (mem) {
    if (Date.now() < mem.expiresAt) {
      return mem.value;
    }
    memoryCache.delete(key);
  }

  /**
   * 2. L2 cache check
   */
  const persistent = persistentCache.get(key);
  if (persistent) {
    /**
     * L2 hit → L1 warmup
     */
    setMemoryCache(key, persistent);
    return persistent;
  }

  return null;
}

/**
 * 캐시 저장
 */
export async function setSiteCache(
  key: string,
  value: SiteDiscoveryResult,
): Promise<void> {
  /**
   * L1 저장
   */
  setMemoryCache(key, value);

  /**
   * L2 저장
   */
  persistentCache.set(key, value);
}

/**
 * L1 cache 저장
 */
function setMemoryCache(key: string, value: SiteDiscoveryResult) {
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + TTL.SITE,
  });
}
