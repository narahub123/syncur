import { UserInterestProfileRepository } from "./UserInterestProfileRepository";

/**
 * UserInterestProfile Repository Instance
 *
 * 서비스 계층에서 주입해서 사용
 */
export const userInterestProfileRepository =
  new UserInterestProfileRepository();
