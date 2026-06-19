import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFaq } from "../api/updateFaq";
import { UpdateFaqDto } from "../../../support/faqs/dtos";

export function useUpdateFaqMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // 인자로 id와 dto를 함께 전달
    mutationFn: (dto: UpdateFaqDto) => updateFaq(id, dto),

    onSuccess: () => {
      // 1. 특정 FAQ 상세 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ["faq", id] });
      // 2. 목록 캐시 갱신 (수정된 내용이 목록에 즉시 반영되도록)
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-faq-infinite"],
      });
    },
  });
}
