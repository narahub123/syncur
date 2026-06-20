import { createInfiniteQuery } from "@/features/admin/hooks/createInfiniteQuery";
import { UserRequestQuery } from "../types/search";
import { RequestResponseDTO } from "../dtos";
import { getMyRequests } from "../api/getMyRequests";

export const useUserRequestsInfiniteQuery = createInfiniteQuery<
  UserRequestQuery,
  RequestResponseDTO,
  unknown
>("admin-notices-infinite", getMyRequests);
