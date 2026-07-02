import { useUserKeywordsQuery } from "@/features/keywords/hooks/useUserKeywordsQuery";
import KeywordItem from "./KeywordItem";

const KeywordList = () => {
  const { data: keywords } = useUserKeywordsQuery();

  if (!keywords) return null;

  return (
    <div className="mt-8 space-y-3">
      {keywords.map((item) => (
        <KeywordItem
          key={item.userKeywordId}
          keywordId={item.userKeywordId}
          keyword={item.keyword}
          targets={item.targets}
          isActive={item.isActive}
        />
      ))}
    </div>
  );
};

export default KeywordList;
