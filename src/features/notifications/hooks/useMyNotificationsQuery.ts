import { useQuery } from "@tanstack/react-query";
import { UserNotificationsQuery } from "../types/search";
import { getMyNotificationsAction } from "../actions/getMyNotificationsAction";

export function useMyNotificationsQuery(query: UserNotificationsQuery) {
  return useQuery({
    queryKey: ["my-notifications", query],
    queryFn: () => getMyNotificationsAction(query),
  });
}
