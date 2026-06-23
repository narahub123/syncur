"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { FEED_QUERY_KEYS } from "../constants/query-keys";
import {
  discoverFeedAction,
  DiscoveryResult,
} from "../actions/discoverFeedAction";

/**
 * 주어진 사이트 URL에서 RSS, Atom, JSON Feed를 탐색하기 위한 커스텀 쿼리 훅입니다.
 * 내부적으로 `discoverFeedAction` 서버 액션을 호출하며 TanStack Query를 통해 캐싱을 관리합니다.
 * * @param {string} url - 탐색 대상이 될 정규화된 웹 사이트 URL
 * @param {boolean} enabled - 쿼리 실행 여부를 결정하는 불리언 값 (보통 디바운싱된 입력값 사용)
 * @returns {UseQueryResult<DiscoveryResult, Error>} 피드 탐색 결과와 쿼리 상태(로딩, 에러 등)를 반환합니다.
 */
export function useFeedDiscoveryQuery(
  url: string,
  enabled: boolean,
): UseQueryResult<DiscoveryResult, Error> {
  return useQuery({
    // 쿼리 키를 통해 해당 URL의 검색 결과만 캐싱합니다.
    queryKey: FEED_QUERY_KEYS.discoveryQuery(url),

    // 피드 탐색 서버 액션을 수행합니다.
    queryFn: () => discoverFeedAction(url),

    // enabled 옵션을 통해 입력값이 존재할 때만 쿼리를 활성화합니다.
    enabled: enabled && url.length > 0,

    // 5분 동안 동일한 URL 요청에 대해 캐시를 유지하여 서버 부하를 줄입니다.
    staleTime: 1000 * 60 * 5,

    // 서버 액션은 명시적 호출이므로, 에러 발생 시 자동 재시도를 하지 않습니다.
    retry: false,
  });
}
