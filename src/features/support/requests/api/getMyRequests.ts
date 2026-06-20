import { getMyRequestsAction } from "../actions/getMyRequestsAction";
import { UserRequestQuery } from "../types/search";

export async function getMyRequests(query: UserRequestQuery) {
  return await getMyRequestsAction(query);
}
