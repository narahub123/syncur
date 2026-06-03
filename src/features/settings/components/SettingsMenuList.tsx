import { SETTINGS_LIST } from "../constants/settings";
import SettingsMenuItem from "./SettingsMenuItem";

/**
 * 설정 메뉴 목록.
 *
 * 사용 가능한 설정 항목을 표시하고
 * 각 항목은 상세 설정 페이지로 이동한다.
 */
const SettingsMenuList = () => {
  return (
    <nav aria-label="설정 메뉴">
      {SETTINGS_LIST.map((item) => (
        <SettingsMenuItem
          key={item.href}
          href={item.href}
          label={item.label}
          category={item.category}
        />
      ))}
    </nav>
  );
};

export default SettingsMenuList;
