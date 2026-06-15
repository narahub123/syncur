"use client";

import { Accordion } from "@/shared/components/ui/accordion";
import { useFaqsQuery } from "../hooks/useFaqsQuery"; // 생성하신 훅 임포트
import FaqAccordionItem from "./FaqAccordionItem";

export function FaqAccordion() {
  // 1. 훅을 통해 데이터 가져오기
  const { data: faqs, isLoading, error } = useFaqsQuery();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>FAQ를 불러올 수 없습니다.</div>;

  return (
    <Accordion type="single" collapsible className="p-4">
      {/* 2. 데이터가 있을 때만 map 실행 */}
      {faqs?.map((faq) => (
        <FaqAccordionItem
          key={faq._id} // 서버 데이터의 ID 사용
          faq={faq}
        />
      ))}
    </Accordion>
  );
}
