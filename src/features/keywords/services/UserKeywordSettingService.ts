import { userKeywordSettingRepository } from "../repositories/UserKeywordSettingRepository.instance";

export class UserKeywordSettingService {
  async createDefaultIfNotExists(userId: string) {
    const existing = await userKeywordSettingRepository.findByUserId(userId);

    if (existing) return existing;

    return userKeywordSettingRepository.createDefault(userId);
  }

  async getByUserId(userId: string) {
    return userKeywordSettingRepository.findByUserId(userId);
  }
}
