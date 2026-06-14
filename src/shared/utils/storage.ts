const ROOT_KEY = "SYNCUR";

// 1. 사용할 모든 키 값을 '상수 객체'로 한 곳에 모아서 정의합니다.
// (as const를 붙여야 타입스크립트가 단순 string이 아닌 고정된 상수로 인식합니다.)
export const STORAGE_KEYS = {
  HIDE_DENIED_BANNER: "hide_denied_banner",
  HIDE_PERMISSION_BANNER: "hide_permission_banner",
  USER: "user",
  THEME: "theme",
} as const;

// 2. [핵심] 위 상수의 '값(Value)'들을 기반으로 타입을 자동으로 추출합니다.
// 결과적으로 'hide_denied_banner' | 'hide_permission_banner' | 'user' | 'theme' 타입이 됩니다.
type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// 3. 각 키가 가질 실제 데이터 타입을 매핑해 줍니다. (여기만 한 번 정의하면 끝!)
interface StoragePayloadMapping {
  [STORAGE_KEYS.HIDE_DENIED_BANNER]: boolean;
  [STORAGE_KEYS.HIDE_PERMISSION_BANNER]: boolean;
  [STORAGE_KEYS.USER]: { name: string; role: string } | null;
  [STORAGE_KEYS.THEME]: "light" | "dark";
}

export const storage = {
  /** 전체 스토리지 객체를 가져오는 내부 함수 */
  _getAll: (): Partial<StoragePayloadMapping> => {
    try {
      const data = localStorage.getItem(ROOT_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("로컬스토리지 읽기 실패:", error);
      return {};
    }
  },

  /** 특정 정보를 추가/수정합니다. */
  set: <K extends StorageKey>(
    key: K,
    value: StoragePayloadMapping[K],
  ): void => {
    try {
      const allData = storage._getAll();
      allData[key] = value;
      localStorage.setItem(ROOT_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error(`로컬스토리지 저장 실패 (key: ${key}):`, error);
    }
  },

  /** 특정 정보를 가져옵니다. */
  get: <K extends StorageKey>(key: K): StoragePayloadMapping[K] | null => {
    const allData = storage._getAll();
    const value = allData[key];
    return value !== undefined ? (value as StoragePayloadMapping[K]) : null;
  },

  /** 특정 정보만 삭제합니다. */
  remove: <K extends StorageKey>(key: K): void => {
    try {
      const allData = storage._getAll();
      delete allData[key];
      localStorage.setItem(ROOT_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error(`로컬스토리지 삭제 실패 (key: ${key}):`, error);
    }
  },

  /** 우리 사이트의 모든 데이터를 날립니다. */
  clear: (): void => {
    try {
      localStorage.removeItem(ROOT_KEY);
    } catch (error) {
      console.error("로컬스토리지 초기화 실패:", error);
    }
  },
};
