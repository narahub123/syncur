import InterestClient from "@/features/interests/components/InterestClient";
import { getCurrentUserInterestProfileService } from "@/features/interests/services/getCurrentUserInterestProfileService";

export default async function InterestsPage() {
  const interests = await getCurrentUserInterestProfileService();
  return <InterestClient interests={interests} />;
}
