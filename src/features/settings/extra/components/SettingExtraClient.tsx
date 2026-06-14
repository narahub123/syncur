"use client";

import SettingsPageHeader from "../../components/SettingsPageHeader";
import NotificationSettingsControl from "./NotificationSettingsControl";

const SettingExtraClient = () => {
  return (
    <div>
      <SettingsPageHeader
        title="기타 설정"
        description="기타 설정을 할 수 있습니다."
      />
      <NotificationSettingsControl />
    </div>
  );
};

export default SettingExtraClient;
