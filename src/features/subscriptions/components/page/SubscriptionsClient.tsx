"use client";

import { useState } from "react";

import SettingsPageHeader from "@/features/settings/components/SettingsPageHeader";
import SubscriptionList from "./SubscriptionList";
import SubscriptionSkeleton from "./SubscriptionSkeleton";
import SubscriptionEmptyState from "./SubscriptionEmptyState";
import { mockSubscriptionView } from "../../mocks/subscription-mock";

const SubscriptionsClient = () => {
  const [isLoading] = useState(false);
  const [subscriptions] = useState(mockSubscriptionView);

  const hasSubscriptions = subscriptions.length > 0;

  return (
    <main>
      <SettingsPageHeader
        title="구독 관리"
        description="구독 중인 사이트를 확인하고 필요에 따라 구독 상태를 변경할 수 있습니다."
      />

      {isLoading && <SubscriptionSkeleton />}

      {!isLoading && !hasSubscriptions && <SubscriptionEmptyState />}

      {!isLoading && hasSubscriptions && (
        <SubscriptionList subscriptions={subscriptions} />
      )}
    </main>
  );
};

export default SubscriptionsClient;
