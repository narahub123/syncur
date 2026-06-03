import SettingsPageHeader from "../../components/SettingsPageHeader";
import { ThemeSettings } from "../theme/components/ThemeSettings";

const AppearanceClient = () => {
  return (
    <div>
      <SettingsPageHeader
        title="화면 설정"
        description="화면의 테마와 표시 방식을 사용 환경에 맞게 조정할 수 있습니다."
      />
      <section>
        <ThemeSettings />
      </section>
    </div>
  );
};

export default AppearanceClient;
