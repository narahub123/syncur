import { subscribeAction } from "../actions/subscribeAction";
import { useSiteSubscriptionStore } from "../store/siteSubscriptionStore";
import { normalizeInputUrl } from "@/features/rss/discovery/utils/normalizeInputUrl";
import { discoverRSS } from "@/features/rss/api/discoverRss";
import { saveSiteAction } from "@/features/rss/site/actions/saveSiteAction";

export async function subscribeController() {
  const { selectedSite, inputValue } = useSiteSubscriptionStore.getState();

  if (!selectedSite && !inputValue) {
    useSiteSubscriptionStore.getState().setError("no site selected");
    return;
  }

  useSiteSubscriptionStore.getState().setSubscribing();

  try {
    /**
     * CASE 1: 이미 DB site 존재
     */
    if (selectedSite?.siteId) {
      const result = await subscribeAction(selectedSite.siteId);

      if (result.status === "already_subscribed") {
        useSiteSubscriptionStore.getState().setAlreadySubscribed();
      } else {
        useSiteSubscriptionStore.getState().setSubscribed();
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
      useSiteSubscriptionStore.getState().setNotSupported();
      return;
    }

    await subscribeAction(savedSite._id);

    useSiteSubscriptionStore.getState().setSubscribed();
  } catch (e) {
    console.error("구독 실패", e);
    useSiteSubscriptionStore.getState().setError("subscribe failed");
  }
}
