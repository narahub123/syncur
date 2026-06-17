import { getRequestAction } from "@/features/support/requests/actions/getRequestAction";
import SupportRequestEditClient from "@/features/support/requests/components/SupportRequestEditClient";

export default async function SupportReuuestEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await getRequestAction(id);

  return <SupportRequestEditClient request={request} />;
}
