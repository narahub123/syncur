import { useQuery } from "@tanstack/react-query";
import { getUserFeedSettingAction } from "../actions/getUserFeedSettingAction";

export const useUserFeedSettingQuery = (subscriptionId: string) => {
  return useQuery({
    queryKey: ["user-feed-setting", subscriptionId],
    queryFn: () => getUserFeedSettingAction(subscriptionId),
    enabled: !!subscriptionId,
  });
};
