import HomeClient from "@/features/home/components/HomeClient";
import { requireGuest } from "@/shared/lib/auth/requireGuest";

export default async function Home() {
  await requireGuest();

  return <HomeClient />;
}
