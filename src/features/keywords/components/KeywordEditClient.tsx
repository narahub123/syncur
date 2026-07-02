"use client";

import { useState, useEffect } from "react";
import { useUserKeywordDetailQuery } from "../hooks/useUserKeywordDetailQuery";
import { MultiSelect } from "@/features/settings/keywords/components/MultiSelect";
import KeywordEditButton from "./KeywordEditButton";

type Props = {
  keywordId: string;
};

const KeywordEditClient = ({ keywordId }: Props) => {
  const { data: keyword, isPending } = useUserKeywordDetailQuery(keywordId);

  const [displayKeyword, setDisplayKeyword] = useState("");
  const [targets, setTargets] = useState<string[]>([]);

  // 초기값 세팅
  useEffect(() => {
    if (!keyword) return;

    setDisplayKeyword(keyword.displayKeyword);
    const initial =
      keyword.targets.length === 0
        ? ["ALL"]
        : keyword.targets.map((t) => t?.subscriptionId);

    setTargets(initial);
  }, [keyword]);

  if (isPending) {
    return <div className="p-4">로딩 중...</div>;
  }

  if (!keyword) {
    return <div className="p-4">키워드를 찾을 수 없습니다.</div>;
  }

  // 전체 선택 옵션 (핵심)
  const options = [
    { label: "전체", value: "ALL" },
    ...keyword.subscriptions.map((s) => ({
      label: s.feedName,
      value: s.subscriptionId,
    })),
  ];

  console.log(keyword.targets);
  console.log(targets);
  console.log(options);

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">키워드 수정</h1>

      {/* 키워드 */}
      <div>
        <label className="text-sm text-gray-500">키워드</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={displayKeyword}
          onChange={(e) => setDisplayKeyword(e.target.value)}
        />
      </div>

      {/* 적용 대상 */}
      <div>
        <label className="text-sm text-gray-500">적용 대상</label>

        <MultiSelect options={options} value={targets} onChange={setTargets} />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2">
        <KeywordEditButton
          userKeywordId={keywordId}
          displayKeyword={displayKeyword}
          keyword={displayKeyword.trim().toLowerCase()}
          subscriptionIds={targets.includes("ALL") ? [] : targets}
        />

        <button className="rounded-md border px-4 py-2 text-gray-500">
          취소
        </button>
      </div>
    </div>
  );
};

export default KeywordEditClient;
