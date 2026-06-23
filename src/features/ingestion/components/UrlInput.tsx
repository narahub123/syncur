"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useFeedDiscoveryQuery } from "../hooks/useFeedDiscoveryQuery";

/**
 * 사용자로부터 웹사이트 URL을 입력받아 RSS/Atom 피드 주소를 자동으로 탐색하는 컴포넌트입니다.
 * * @component
 * @example
 * <UrlInput />
 */
export function UrlInput() {
  /** 사용자가 입력하는 URL 상태 */
  const [input, setInput] = useState<string>("");

  /** 입력값에 디바운싱을 적용하여 API 호출 빈도를 최적화합니다 (500ms). */
  const debouncedInput = useDebounce(input, 500);

  // debouncedInput이 빈 값일 때는 아예 쿼리를 실행하지 않도록 명시
  const isEnabled = debouncedInput.length > 0;

  /** * TanStack Query를 사용하여 서버 액션을 통해 피드를 탐색합니다.
   * @property data - 서버로부터 반환된 피드 탐색 결과
   * @property isPending - 현재 데이터를 불러오는 로딩 상태인지 여부
   * @property isError - 서버 요청 실패 여부
   */
  const { data, isPending, isError } = useFeedDiscoveryQuery(
    debouncedInput,
    isEnabled,
  );

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <div className="flex gap-2">
        <Input
          placeholder="https://example.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          /* 에러 발생 시 입력창 테두리를 붉게 표시합니다. */
          className={isError ? "border-red-500" : ""}
        />
        <Button
          /* 피드 URL을 찾지 못했거나 로딩 중일 때는 구독 버튼을 비활성화합니다. */
          disabled={!data?.feedUrl || isPending}
          onClick={() => alert(`구독 시작: ${data?.feedUrl}`)}
        >
          구독하기
        </Button>
      </div>

      {/* 데이터 탐색 중 로딩 상태 표시 */}
      {isPending && debouncedInput.length > 0 && (
        <p className="text-sm text-gray-500">피드 탐색 중...</p>
      )}

      {/* 서버 요청 에러 발생 시 안내 */}
      {isError && (
        <p className="text-sm text-red-500">탐색 중 오류가 발생했습니다.</p>
      )}

      {/* 피드 탐색 성공 시 결과 출력 */}
      {data?.success && data.feedUrl && (
        <p className="text-sm text-green-600">
          피드를 찾았습니다: {data.feedUrl}
        </p>
      )}

      {/* 탐색은 성공했으나 피드를 찾지 못한 경우 메시지 출력 */}
      {data?.success === false && (
        <p className="text-sm whitespace-pre-line text-yellow-600">
          {data.message}
        </p>
      )}
    </div>
  );
}
