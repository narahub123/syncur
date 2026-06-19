import { useQuery } from "@tanstack/react-query";
import { getMyRequestsAction } from "../actions/getMyRequestsAction";
import { requestKeys } from "../constants/requestKeys";
import { UserRequestQuery } from "../types/user-search";

export function useUserRequestsQuery(query: UserRequestQuery) {
  return useQuery({
    queryKey: requestKeys.userList(query),
    queryFn: () => getMyRequestsAction(query),
    placeholderData: (previousData) => previousData, // 페이지 전환 시 데이터 유지
  });
}
