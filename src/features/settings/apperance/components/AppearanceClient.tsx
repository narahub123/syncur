import { SettingsCard } from "../../components/SettingCard";
import SettingsPageHeader from "../../components/SettingsPageHeader";
import { ThemeSettings } from "../theme/components/ThemeSettings";

const AppearanceClient = () => {
  const appearanceCards = [
    {
      id: "theme",
      component: <ThemeSettings />,
    },
  ];
  return (
    <div>
      <SettingsPageHeader
        title="화면 설정"
        description="화면의 테마와 표시 방식을 사용 환경에 맞게 조정할 수 있습니다."
      />
      {appearanceCards.map((card) => (
        <SettingsCard key={card.id}>{card.component}</SettingsCard>
      ))}
    </div>
  );
};

export default AppearanceClient;
