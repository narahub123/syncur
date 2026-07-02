import { useQuery } from "@tanstack/react-query";
import { userKeywordSettingQueryKey } from "../constants/queryKeys";
import { getUserKeywordSettingAction } from "../actions/getUserKeywordSettingAction";

export const useUserKeywordSettingQuery = () => {
  return useQuery({
    queryKey: userKeywordSettingQueryKey(),
    queryFn: getUserKeywordSettingAction,
  });
};
