import InterestClient from "@/features/interests/components/InterestClient";

import { userInterestProfileService } from "@/features/interests/services/UserInterestProfileService.instance";

export default async function InterestsPage() {
  const interests =
    await userInterestProfileService.getCurrentUserInterestProfile();
  return <InterestClient interests={interests} />;
}
