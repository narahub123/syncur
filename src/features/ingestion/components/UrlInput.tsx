import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { normalizeUrl } from "../utils/url";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function UrlInput() {
  const [input, setInput] = useState<string>("");
  const [sanitizedUrl, setSanitizedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. 입력값을 디바운싱합니다.
  const debouncedInput = useDebounce(input, 500);

  // 2. 디바운스된 값이 바뀔 때마다 검증 로직 실행
  useEffect(() => {
    if (!debouncedInput) {
      setSanitizedUrl(null);
      setError(null);
      return;
    }

    try {
      const result = normalizeUrl(debouncedInput);
      setSanitizedUrl(result);
      setError(null);
    } catch (err: unknown) {
      setSanitizedUrl(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  }, [debouncedInput]);

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <div className="flex gap-2">
        <Input
          placeholder="https://example.com"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          className={error ? "border-red-500" : ""}
        />
        <Button
          disabled={!sanitizedUrl}
          onClick={() => alert(`구독 시작: ${sanitizedUrl}`)}
        >
          구독하기
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {sanitizedUrl && !error && (
        <p className="text-sm text-green-600">유효한 URL입니다!</p>
      )}
    </div>
  );
}
