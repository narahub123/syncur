import { markNotificationAsReadAction } from "../actions/markNotificationAsReadAction";

export const markNotificationAsRead = async (id: string) => {
  return await markNotificationAsReadAction(id);
};
