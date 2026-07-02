import { useQuery } from "@tanstack/react-query";
import { getUserKeywordsAction } from "../actions/getUserKeywordsAction";

export const useUserKeywordsQuery = () => {
  return useQuery({
    queryKey: ["keywords"],
    queryFn: () => getUserKeywordsAction(),
  });
};
