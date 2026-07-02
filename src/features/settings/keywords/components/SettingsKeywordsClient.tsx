"use client";

import DefaultSettingSection from "./DefaultSettingSection";
import KeywordSection from "./KeywordSection";
import SubscriptionSettingSection from "./SubscriptionSettingSection";

const SettingsKeywordsClient = () => {
  return (
    <div className="space-y-8">
      <KeywordSection />

      <DefaultSettingSection />

      <SubscriptionSettingSection />
    </div>
  );
};

export default SettingsKeywordsClient;
