import { useEffect, useRef } from "react";

// 💡 1. 훅이 처리할 데이터 타입을 외부에서 동적으로 지정할 수 있도록 제네릭 <T> 도입
type Props<T> = {
  url: string;
  eventName: string;
  onEvent: (data: T) => void;
};

export function useSSE<T = unknown>({ url, eventName, onEvent }: Props<T>) {
  const esRef = useRef<EventSource | null>(null);

  // 최신 익명 함수를 항상 참조할 수 있도록 useRef에 저장 (무한 재연결 방지 핵심)
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    const es = new EventSource(url);
    esRef.current = es;

    // 1. 일반 메시지 핸들러 (이벤트명이 없는 경우 - ping, connected 등)
    es.onmessage = (e) => {
      // 필요 시 일반 메시지 처리 로직 작성
    };

    // 2. 핵심: 서버의 상수가 담긴 커스텀 이벤트 리스너 등록
    const handleCustomEvent = (e: MessageEvent) => {
      try {
        const parsedData = JSON.parse(e.data) as T; // 💡 파싱된 데이터를 제네릭 타입 T로 명시적 단언
        onEventRef.current(parsedData); // 최신 핸들러 함수 호출
      } catch (err) {
        // 💡 catch 문 내부의 에러도 안전하게 unknown/Error 가드 처리
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 에러";
        console.error("❌ SSE 데이터 파싱 실패:", errorMessage);
      }
    };

    es.addEventListener(eventName, handleCustomEvent);

    es.onerror = (err) => {
      console.error("❌ SSE 통신 에러 (재연결 시도 중...):", err);
    };

    // 클린업 시 리스너 제거 및 연결 종료
    return () => {
      es.removeEventListener(eventName, handleCustomEvent);
      es.close();
      esRef.current = null;
    };
  }, [url, eventName]); // 함수 참조(onEvent)를 의존성에서 제거하여 무한 재연결 방지
}
