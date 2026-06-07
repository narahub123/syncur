"use client";

import SettingsPageHeader from "@/features/settings/components/SettingsPageHeader";
import SubscriptionList from "./SubscriptionList";
import SubscriptionEmptyState from "./SubscriptionEmptyState";
import { useSubscriptionsQuery } from "../../hooks/useSubscriptionsQuery";
import SubscriptionItemSkeleton from "./SubscriptionSkeleton";

const SubscriptionsClient = () => {
  const { data: subscriptions, isFetching } = useSubscriptionsQuery();

  console.log("구독 목록", subscriptions);
  const hasSubscriptions = subscriptions && subscriptions.length > 0;

  return (
    <main>
      <SettingsPageHeader
        title="구독 관리"
        description="구독 중인 사이트를 확인하고 필요에 따라 구독 상태를 변경할 수 있습니다."
      />

      {isFetching && <SubscriptionItemSkeleton />}
      {!isFetching && !hasSubscriptions && <SubscriptionEmptyState />}

      {!isFetching && hasSubscriptions && (
        <SubscriptionList subscriptions={subscriptions} />
      )}
    </main>
  );
};

export default SubscriptionsClient;
