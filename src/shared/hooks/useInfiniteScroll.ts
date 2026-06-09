"use client";

import { useEffect, useRef } from "react";

type Options = {
  onIntersect: () => void; // 요소가 화면에 보였을 때 실행할 콜백 (다음 페이지 fetch 트리거)
  enabled: boolean; // observer 동작 여부 제어 (false면 스크롤 감지 비활성화)
};

/**
 * 무한 스크롤을 위한 IntersectionObserver 기반 hook
 *
 * - 특정 DOM 요소(ref)가 화면에 나타나는 순간(onIntersect)
 *   다음 데이터를 요청하도록 설계
 *
 * - React Query의 fetchNextPage와 함께 사용하는 것을 전제로 함
 */
export function useInfiniteScroll({ onIntersect, enabled }: Options) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // observer 비활성화 상태면 아무것도 하지 않음
    if (!enabled) return;

    /**
     * IntersectionObserver 생성
     * - entry.isIntersecting === true: 요소가 viewport에 들어옴
     */
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // 스크롤이 하단 sentinel에 도달했을 때 실행
        onIntersect();
      }
    });

    const el = ref.current;

    // ref가 실제 DOM에 연결된 경우만 observe 시작
    if (el) observer.observe(el);

    return () => {
      // 컴포넌트 언마운트 또는 deps 변경 시 정리
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [onIntersect, enabled]);

  // observer를 붙일 대상 DOM ref 반환
  return ref;
}
