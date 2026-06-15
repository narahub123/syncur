import { useQuery } from "@tanstack/react-query";
import { getPublicFaqs } from "../api/getPublicFaqs";

export function useFaqsQuery() {
  return useQuery({
    queryKey: ["faqs"], // 사용자용 캐시 키
    queryFn: () => getPublicFaqs(),
  });
}
