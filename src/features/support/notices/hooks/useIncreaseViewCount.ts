import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { incrementViewAction } from "../actions/incrementViewAction";

export function useIncreaseViewCount(id: string) {
  const queryClient = useQueryClient();
  const hasIncreased = useRef(false);

  const { mutate } = useMutation({
    mutationFn: () => incrementViewAction(id),
    onSuccess: () => {
      // 목록 페이지 캐시 갱신 (즉시 반영)
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
    },
  });

  useEffect(() => {
    // 마운트 시 한 번만 실행 (StrictMode 방지)
    if (!hasIncreased.current) {
      mutate();
      hasIncreased.current = true;
    }
  }, [mutate]);
}
