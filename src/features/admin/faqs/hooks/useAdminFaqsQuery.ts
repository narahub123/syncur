import { useQuery } from "@tanstack/react-query";
import { getAdminFaqs } from "../api/getAdminFaqs";
import { AdminFaqsQuery } from "../types/search";

export function useAdminFaqsQuery(query: AdminFaqsQuery) {
  return useQuery({
    // queryKey에 query 객체를 포함시켜야 상태 변경 시 자동으로 캐시가 갱신됩니다.
    queryKey: ["admin-faqs", query],
    queryFn: () => getAdminFaqs(query),
    // 데이터가 변경되어도 이전 데이터를 유지하고 싶다면 keepPreviousData 등을 활용 가능
  });
}
