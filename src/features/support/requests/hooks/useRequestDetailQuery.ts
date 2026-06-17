import { useQuery } from "@tanstack/react-query";
import { getRequestDetailAction } from "../actions/getRequestDetailAction";
import { RequestResponseDTO } from "../dtos";
import { requestKeys } from "../constants/requestKeys";

export function useRequestDetailQuery(requestId: string) {
  return useQuery<RequestResponseDTO>({
    queryKey: requestKeys.userDetail(requestId),
    queryFn: () => getRequestDetailAction(requestId),
    enabled: !!requestId,
  });
}
