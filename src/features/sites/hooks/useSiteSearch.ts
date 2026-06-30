import { searchSiteAction } from "@/features/sites/actions/searchSiteAction";
import { useQuery } from "@tanstack/react-query";

export const useSiteSearch = (query: string) => {
  return useQuery({
    queryKey: ["site-search", query],
    queryFn: () => searchSiteAction(query),
    enabled: query.trim().length > 0,
  });
};
