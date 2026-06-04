import { create } from "zustand";
import type { UIState, WebSource, FeedEndpoint } from "../types/feed-discovery";

/**
 * FeedDiscoveryState
 *
 * 역할:
 * - URL 기반 사이트 검색 → feed discovery → subscription 전체 flow 관리
 * - UI 상태 머신의 단일 source of truth
 */
export type FeedDiscoveryState = {
  /** 현재 UI 상태 (state machine 핵심 값) */
  uiState: UIState;

  /** site 검색 결과 목록 */
  siteOptions: WebSource[];

  /** 사용자가 선택한 사이트 */
  selectedSite: WebSource | null;

  /** 발견된 feed 정보 */
  feed: FeedEndpoint | null;

  /* =========================
   * ACTIONS (state transitions)
   * ========================= */

  /** site 검색 API 호출 후 결과 저장 */
  searchSite: (query: string) => Promise<void>;

  /** site 선택 */
  selectSite: (site: WebSource) => void;

  /** feed discovery 시작 */
  startDiscovery: () => Promise<void>;

  /** feed 발견 성공 */
  setFeedFound: (feed: FeedEndpoint) => void;

  /** feed 미지원 */
  setFeedNotSupported: () => void;

  /** 구독 시작 */
  startSubscribe: () => Promise<void>;

  /** 구독 완료 */
  setSubscribed: () => void;

  /** 에러 처리 */
  setError: (message: string) => void;

  /** 상태 초기화 */
  reset: () => void;
};

export const useFeedDiscoveryStore = create<FeedDiscoveryState>((set, get) => ({
  /* =========================
   * INITIAL STATE
   * ========================= */
  uiState: "idle",
  siteOptions: [],
  selectedSite: null,
  feed: null,

  /* =========================
   * ACTION IMPLEMENTATIONS
   * ========================= */

  /**
   * site 검색
   * - URL 입력 기반 site 후보 검색
   * - server action 또는 API 연결 지점
   */
  searchSite: async (query) => {
    set({ uiState: "searching_site" });

    try {
      // TODO: 실제 server action 연결
      // const result = await searchSiteAction(query);

      const result: WebSource[] = []; // 임시 placeholder

      set({
        siteOptions: result,
        uiState: "typing",
      });
    } catch (e) {
      set({ uiState: "error" });
    }
  },

  /**
   * site 선택
   * - combobox에서 선택된 site 저장
   * - 이후 discovery flow 트리거 대상
   */
  selectSite: (site) => {
    set({
      selectedSite: site,
      uiState: "site_selected",
    });
  },

  /**
   * feed discovery 시작
   * - 선택된 site 기반으로 feed 탐색
   */
  startDiscovery: async () => {
    const site = get().selectedSite;

    if (!site) {
      set({ uiState: "error" });
      return;
    }

    set({ uiState: "discovering" });

    try {
      // TODO: discoverySite API 연결
      // const feed = await discoverySite(site.url);

      const feed: FeedEndpoint | null = null;

      if (feed) {
        set({
          feed,
          uiState: "feed_found",
        });
      } else {
        set({
          uiState: "feed_not_supported",
        });
      }
    } catch (e) {
      set({ uiState: "error" });
    }
  },

  /**
   * feed 발견 성공 처리
   */
  setFeedFound: (feed) => {
    set({
      feed,
      uiState: "feed_found",
    });
  },

  /**
   * feed 미지원 처리
   */
  setFeedNotSupported: () => {
    set({
      uiState: "feed_not_supported",
    });
  },

  /**
   * 구독 시작
   */
  startSubscribe: async () => {
    set({ uiState: "subscribing" });

    try {
      // TODO: subscribe API 연결
      // await subscribeFeed(get().feed)
    } catch (e) {
      set({ uiState: "error" });
    }
  },

  /**
   * 구독 완료
   */
  setSubscribed: () => {
    set({ uiState: "subscribed" });
  },

  /**
   * 에러 처리
   */
  setError: () => {
    set({ uiState: "error" });
  },

  /**
   * 전체 상태 초기화
   */
  reset: () => {
    set({
      uiState: "idle",
      siteOptions: [],
      selectedSite: null,
      feed: null,
    });
  },
}));
