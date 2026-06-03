import SettingsMenuList from "./SettingsMenuList";
import SettingsPageHeader from "./SettingsPageHeader";

const SettingsClient = () => {
  return (
    <div>
      <SettingsPageHeader
        title="설정 페이지"
        description="관심사, 알림 등 개인 설정을 관리할 수 있습니다."
      />
      <SettingsMenuList />
    </div>
  );
};

export default SettingsClient;
