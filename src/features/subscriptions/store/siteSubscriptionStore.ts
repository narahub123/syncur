import { create } from "zustand";
import type { SiteContextDTO } from "@/features/rss/site/dto/siteDto";
import { SiteSubscriptionState } from "../types/site-subscription-status";

/**
 * SiteSubscriptionStoreState
 *
 * 역할:
 * - 사용자의 URL 입력 → 사이트 후보 탐색 → 사이트 선택 → 구독까지의 UI 흐름 관리
 * - "UI 상태 + 입력값 + 후보 리스트 + 선택 상태"만 관리
 *
 * ❗ 핵심 원칙
 * - RSS 탐색, subscription 생성 등 비즈니스 로직은 절대 포함하지 않음
 * - store는 UI 상태 저장소 역할만 수행
 */
type SiteSubscriptionStoreState = {
  /* =========================
   * STATE
   * ========================= */

  /**
   * 현재 UI 상태
   * - 화면이 어떤 단계인지 결정하는 최소 상태 머신
   */
  status: SiteSubscriptionState;

  /**
   * 사용자 입력값 (controlled input)
   */
  inputValue: string;

  /**
   * 사이트 검색 결과 (combobox suggestion 목록)
   */
  siteOptions: SiteContextDTO[];

  /**
   * 사용자가 선택한 사이트
   * - 없으면 null (직접 입력 상태 포함)
   */
  selectedSite: SiteContextDTO | null;

  /* =========================
   * ACTIONS (UI ONLY)
   * ========================= */

  /**
   * input 값 업데이트
   * - controlled input 반영만 담당
   */
  setInputValue: (value: string) => void;

  /**
   * 사이트 검색 결과 반영
   * - TanStack Query or hook에서 받은 결과를 store에 반영
   */
  setSiteOptions: (options: SiteContextDTO[]) => void;

  /**
   * 사이트 선택 처리
   * - combobox에서 선택된 site 반영
   * - input 값 동기화
   */
  selectSite: (site: SiteContextDTO) => void;

  setIdle: () => void;

  /**
   * 구독 진행 상태로 전환
   */
  setProcessing: () => void;

  /**
   * 구독 성공 상태로 전환
   */
  setSubscribed: () => void;

  /**
   * 이미 구독 중인 상태로 전환
   */
  setAlreadySubscribed: () => void;

  /**
   * RSS를 지원하지 않는 상태로 전환
   */
  setNotSupported: () => void;

  /**
   * 에러 상태 설정
   */
  setError: (message?: string) => void;

  /**
   * 전체 상태 초기화
   */
  reset: () => void;

  /**
   * crawlDiaglog
   */
  crawlDialogOpen: boolean;
  setCrawlDialogOpen: (crawlDialogOpen: boolean) => void;
};

export const useSiteSubscriptionStore = create<SiteSubscriptionStoreState>(
  (set) => ({
    /* =========================
     * INITIAL STATE
     * ========================= */

    status: "idle",
    inputValue: "",
    siteOptions: [],
    selectedSite: null,

    /* =========================
     * ACTIONS
     * ========================= */

    /**
     * input 값 변경
     * - controlled input 업데이트만 담당
     */
    setInputValue: (value) => {
      set({
        inputValue: value,
      });
    },

    /**
     * siteOptions 업데이트
     * - TanStack Query 결과를 store에 반영
     */
    setSiteOptions: (options) => {
      set({
        siteOptions: options,
      });
    },

    /**
     * 사이트 선택
     * - combobox에서 선택된 site 반영
     * - input 값 동기화
     */
    selectSite: (site) => {
      console.log("selectSite 눌림");
      set({
        selectedSite: site,
        inputValue: site.url,
      });
    },

    setIdle: () => {
      set({ status: "idle" });
    },

    /**
     * 구독 처리 시작 상태
     */
    setProcessing: () => {
      set({ status: "processing" });
    },

    /**
     * 구독 성공 상태
     */
    setSubscribed: () => {
      set({ status: "subscribed" });
    },

    /**
     *
     */
    setAlreadySubscribed: () => {
      set({ status: "already_subscribed" });
    },

    /**
     *
     */
    setNotSupported: () => {
      set({ status: "not_supported" });
    },

    /**
     * 에러 상태 설정
     */
    setError: (message) => {
      if (message) console.error(message);
      set({ status: "error" });
    },

    /**
     * 전체 상태 초기화
     */
    reset: () => {
      set({
        status: "idle",
        inputValue: "",
        siteOptions: [],
        selectedSite: null,
      });
    },

    crawlDialogOpen: false,
    setCrawlDialogOpen: (crawlDialogOpen: boolean) =>
      set({
        crawlDialogOpen,
      }),
  }),
);
