import { buildSiteContext } from "@/features/rss/site/domain/siteContext";
import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { dedupedDiscoverSite } from "./dedupedDiscoverSite";

export async function getSiteSubscriptionContext(
  normalizedUrl: string,
  userId: string,
) {
  // 1. site 후보 조회
  let sites = await siteRepository.search(normalizedUrl);

  // 2. fallback: discovery only if empty
  if (sites.length === 0) {
    const discovered = await dedupedDiscoverSite(normalizedUrl);

    if (discovered) {
      const saved = await siteRepository.upsert(discovered);
      sites = [saved];
    }
  }

  // 3. subscription batch 조회
  const subscriptions = await subscriptionRepository.findByUserId(userId);

  const subMap = new Set(subscriptions.map((s) => s.siteId));

  // 3. merge
  return sites.map((site) => {
    const subscriptionExists = subMap.has(site._id);

    return buildSiteContext({
      site,
      subscriptionExists,
    });
  });
}
