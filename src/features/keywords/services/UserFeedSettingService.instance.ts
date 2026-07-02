import { userFeedSettingRepository } from "../repositories/UserFeedSettingRepository.instance";
import { UserFeedSettingService } from "./UserFeedSettingService";

export const userFeedSettingService = new UserFeedSettingService(
  userFeedSettingRepository,
);
