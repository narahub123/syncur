import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFaq } from "../api/createFaq";
import { CreateFaqDto } from "../../../support/faqs/dtos";

/**
 * FAQ 생성 처리 Mutation
 */
export function useCreateFaqMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateFaqDto) => createFaq(dto),

    // 데이터가 성공적으로 생성되면 관련 FAQ 캐시 목록 전체를 갱신 리프레시
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });

      // 만약 어드민 전용 faq 키가 따로 분리되어 있다면 함께 무효화 처리합니다.
      queryClient.invalidateQueries({
        queryKey: ["admin-faqs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-faq-infinite"],
      });
    },
  });
}
