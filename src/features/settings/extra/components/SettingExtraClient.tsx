"use client";

import { SettingsCard } from "../../components/SettingCard";
import SettingsPageHeader from "../../components/SettingsPageHeader";
import NotificationSettingsControl from "./NotificationSettingsControl";

const SettingExtraClient = () => {
  const extraCards = [
    {
      id: "notification",
      component: <NotificationSettingsControl />,
    },
  ];
  return (
    <div>
      <SettingsPageHeader
        title="기타 설정"
        description="기타 설정을 할 수 있습니다."
      />
      {extraCards.map((card) => (
        <SettingsCard key={card.id}>{card.component}</SettingsCard>
      ))}
    </div>
  );
};

export default SettingExtraClient;
