"use client";

import { useSubscriptionsQuery } from "@/features/subscriptions/hooks/useSubscriptionsQuery";
import DefaultSettingSection from "./DefaultSettingSection";
import KeywordSection from "./KeywordSection";
import SubscriptionSettingSection from "./SubscriptionSettingSection";

const SettingsKeywordsClient = () => {
  const { data } = useSubscriptionsQuery(1, 10);

  if (!data) return null;

  return (
    <div className="space-y-8">
      <KeywordSection data={data} />

      <DefaultSettingSection />

      <SubscriptionSettingSection data={data} />
    </div>
  );
};

export default SettingsKeywordsClient;
