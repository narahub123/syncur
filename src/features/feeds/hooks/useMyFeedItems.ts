import { useQuery } from "@tanstack/react-query";
import { getMyFeedItemsAction } from "../actions/getMyFeedItemsAction";

export function useMyFeedItems() {
  return useQuery({
    queryKey: ["my-feed-items"],
    queryFn: () => getMyFeedItemsAction(),
  });
}
