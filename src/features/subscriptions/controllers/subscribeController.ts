import { subscribeAction } from "../actions/subscribeAction";
import { useFeedDiscoveryStore } from "../store/feedDiscovery";
import { normalizeInputUrl } from "@/features/rss/discovery/utils/normalizeInputUrl";
import { discoverRSS } from "@/features/rss/api/discoverRss";
import { saveSiteAction } from "@/features/rss/site/actions/saveSiteAction";

export async function subscribeController() {
  const { selectedSite, inputValue } = useFeedDiscoveryStore.getState();

  if (!selectedSite && !inputValue) {
    useFeedDiscoveryStore.getState().setError("no site selected");
    return;
  }

  useFeedDiscoveryStore.getState().setSubscribing();

  try {
    /**
     * CASE 1: 이미 DB site 존재
     */
    if (selectedSite?._id) {
      const result = await subscribeAction(selectedSite._id);

      if (result.status === "already_subscribed") {
        useFeedDiscoveryStore.getState().setAlreadySubscribed();
      } else {
        useFeedDiscoveryStore.getState().setSubscribed();
      }

      return;
    }

    const normalizedUrl = normalizeInputUrl(inputValue);

    /**
     * CASE 2: inputValue 기반
     */
    const result = await discoverRSS(normalizedUrl);

    const savedSite = await saveSiteAction(result.site);

    if (result.type !== "found") {
      useFeedDiscoveryStore.getState().setNotSupported();
      return;
    }

    await subscribeAction(savedSite._id);

    useFeedDiscoveryStore.getState().setSubscribed();
  } catch (e) {
    console.error("구독 실패", e);
    useFeedDiscoveryStore.getState().setError("subscribe failed");
  }
}
