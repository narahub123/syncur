// src/features/subscription/store/feedDiscovery.store.ts

import { create } from "zustand";
import type { UIState, WebSource, FeedEndpoint } from "../types/feed-discovery";

interface FeedDiscoveryState {
  // ======================
  // STATE
  // ======================
  uiState: UIState;

  url: string;

  selectedSite: WebSource | null;
  selectedFeed: FeedEndpoint | null;

  error: string | null;

  // ======================
  // INPUT
  // ======================
  setUrl: (url: string) => void;
  setTyping: () => void;

  // ======================
  // SITE FLOW
  // ======================
  startSiteSearch: () => void;
  selectSite: (site: WebSource) => void;

  // ======================
  // FEED DISCOVERY FLOW
  // ======================
  startDiscovery: () => void;

  setFeedFound: (feeds: FeedEndpoint[]) => void;

  setFeedNotSupported: () => void;

  selectFeed: (feed: FeedEndpoint) => void;

  // ======================
  // SUBSCRIPTION FLOW
  // ======================
  startSubscribe: () => void;

  setSubscribed: () => void;

  // ======================
  // ERROR / RESET
  // ======================
  setError: (message: string) => void;

  reset: () => void;
}

export const useFeedDiscoveryStore = create<FeedDiscoveryState>((set, get) => ({
  // ======================
  // INITIAL STATE
  // ======================
  uiState: "idle",
  url: "",
  selectedSite: null,
  selectedFeed: null,
  error: null,

  // ======================
  // INPUT
  // ======================
  setUrl: (url) =>
    set(() => ({
      url,
      uiState: url.length > 0 ? "typing" : "idle",
    })),

  setTyping: () =>
    set(() => ({
      uiState: "typing",
    })),

  // ======================
  // SITE FLOW
  // ======================
  startSiteSearch: () =>
    set(() => ({
      uiState: "searching_site",
    })),

  selectSite: (site) =>
    set(() => ({
      selectedSite: site,
      uiState: "site_selected",
    })),

  // ======================
  // FEED DISCOVERY FLOW
  // ======================
  startDiscovery: () =>
    set(() => ({
      uiState: "discovering",
      error: null,
    })),

  setFeedFound: (feeds) =>
    set(() => ({
      uiState: "feed_found",
      selectedFeed: feeds?.[0] ?? null,
    })),

  setFeedNotSupported: () =>
    set(() => ({
      uiState: "feed_not_supported",
    })),

  selectFeed: (feed) =>
    set(() => ({
      selectedFeed: feed,
    })),

  // ======================
  // SUBSCRIBE FLOW
  // ======================
  startSubscribe: () =>
    set(() => ({
      uiState: "subscribing",
    })),

  setSubscribed: () =>
    set(() => ({
      uiState: "subscribed",
    })),

  // ======================
  // ERROR
  // ======================
  setError: (message) =>
    set(() => ({
      uiState: "error",
      error: message,
    })),

  // ======================
  // RESET
  // ======================
  reset: () =>
    set(() => ({
      uiState: "idle",
      url: "",
      selectedSite: null,
      selectedFeed: null,
      error: null,
    })),
}));
