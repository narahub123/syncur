import { useUserKeywordsQuery } from "@/features/keywords/hooks/useUserKeywordsQuery";
import KeywordItem from "./KeywordItem";

const KeywordList = () => {
  const { data: keywords, isLoading } = useUserKeywordsQuery();

  if (!keywords) return null;

  return (
    <div className="mt-8 space-y-3">
      {keywords.map((item) => (
        <KeywordItem
          key={item.keyword}
          keyword={item.keyword}
          targets={item.targets}
        />
      ))}
    </div>
  );
};

export default KeywordList;
