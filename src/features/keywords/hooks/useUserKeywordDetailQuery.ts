import { useQuery } from "@tanstack/react-query";
import { getUserKeywordDetailAction } from "../actions/getUserKeywordDetailAction";

export const useUserKeywordDetailQuery = (keywordId: string) => {
  return useQuery({
    queryKey: ["keywords", "detail", keywordId],
    queryFn: () => getUserKeywordDetailAction(keywordId),
    enabled: !!keywordId,
  });
};
