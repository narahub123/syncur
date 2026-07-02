import SubscriptionDetailClient from "@/features/subscriptions/components/SubscriptionDetailClient";

type Props = {
  params: Promise<{ subscriptionId: string }>;
};

export default async function SubscriptionDetailPage({ params }: Props) {
  const { subscriptionId } = await params;

  return <SubscriptionDetailClient subscriptionId={subscriptionId} />;
}
