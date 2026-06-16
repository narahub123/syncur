import { useQuery } from "@tanstack/react-query";
import { getRequestDetailAction } from "./getRequestDetailAction";
import { RequestResponseDTO } from "../dtos";

export function useRequestDetailQuery(requestId: string) {
  return useQuery<RequestResponseDTO>({
    queryKey: ["requests", "detail", requestId],
    queryFn: () => getRequestDetailAction(requestId),
    enabled: !!requestId,
  });
}
