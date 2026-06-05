import { create } from "zustand";
import type { UIState, FeedEndpoint } from "../types/feed-discovery";
import { searchSiteAction } from "../actions/searchSiteAction";
import { SiteSearchDto } from "@/features/rss/site/dto/search-site";

/**
 * FeedDiscoveryState
 *
 * 역할:
 * - URL 기반 사이트 검색 → feed discovery → subscription 전체 flow 관리
 * - UI 상태 머신 단일 source of truth
 */
export type FeedDiscoveryState = {
  /* =========================
   * UI STATE
   * ========================= */

  /** 현재 UI 상태 */
  uiState: UIState;

  /** input 값 (controlled input 핵심) */
  inputValue: string;

  /** site 검색 결과 */
  siteOptions: SiteSearchDto[];

  /** 선택된 site */
  selectedSite: SiteSearchDto | null;

  /** 발견된 feed */
  feed: FeedEndpoint | null;

  /* =========================
   * ACTIONS
   * ========================= */

  searchSite: (query: string) => Promise<void>;
  selectSite: (site: SiteSearchDto) => void;

  startDiscovery: () => Promise<void>;

  setFeedFound: (feed: FeedEndpoint) => void;
  setFeedNotSupported: () => void;

  startSubscribe: () => Promise<void>;
  setSubscribed: () => void;

  setError: (message?: string) => void;

  setInputValue: (value: string) => void;

  reset: () => void;
};

export const useFeedDiscoveryStore = create<FeedDiscoveryState>((set, get) => ({
  /* =========================
   * INITIAL STATE
   * ========================= */

  uiState: "idle",
  inputValue: "",
  siteOptions: [],
  selectedSite: null,
  feed: null,

  /* =========================
   * ACTIONS
   * ========================= */

  /**
   * 입력값 업데이트 (Combobox controlled 핵심)
   */
  setInputValue: (value) => {
    set({ inputValue: value });
  },

  /**
   * site 검색
   */
  searchSite: async (query) => {
    set({
      uiState: "searching_site",
      inputValue: query,
    });

    try {
      const result = await searchSiteAction(query);

      set({
        siteOptions: result,
        uiState: "typing",
      });
    } catch (e) {
      set({ uiState: "error" });
      console.error("조회 실패", e);
    }
  },

  /**
   * site 선택
   */
  selectSite: (site) => {
    set({
      selectedSite: site,
      inputValue: site.url, // UX: 선택 시 입력값 동기화
      uiState: "site_selected",
    });
  },

  /**
   * feed discovery
   */
  startDiscovery: async () => {
    const site = get().selectedSite;

    if (!site) {
      set({ uiState: "error" });
      return;
    }

    set({ uiState: "discovering" });

    try {
      // TODO: discovery API
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
    } catch {
      set({ uiState: "error" });
    }
  },

  /**
   * feed 성공
   */
  setFeedFound: (feed) => {
    set({
      feed,
      uiState: "feed_found",
    });
  },

  /**
   * feed 없음
   */
  setFeedNotSupported: () => {
    set({
      uiState: "feed_not_supported",
    });
  },

  /**
   * subscribe 시작
   */
  startSubscribe: async () => {
    set({ uiState: "subscribing" });

    try {
      // TODO: subscribe API
    } catch {
      set({ uiState: "error" });
    }
  },

  /**
   * subscribe 완료
   */
  setSubscribed: () => {
    set({ uiState: "subscribed" });
  },

  /**
   * 에러 처리
   */
  setError: (message?: string) => {
    console.error(message);
    set({ uiState: "error" });
  },

  /**
   * reset
   */
  reset: () => {
    set({
      uiState: "idle",
      inputValue: "",
      siteOptions: [],
      selectedSite: null,
      feed: null,
    });
  },
}));
