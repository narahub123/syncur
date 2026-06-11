import { FeedWithSiteDto } from "@/features/feeds/dto/feedDto";
import { useUpdateFeedStatus } from "../hooks/useUpdateFeedStatusMutation";
import FeedStatusSelect from "./FeedStatusSelect";

type Props = {
  feed: FeedWithSiteDto;
};

export function AdminFeedStatusSelect({ feed }: Props) {
  const { mutate } = useUpdateFeedStatus();

  return (
    <FeedStatusSelect
      value={feed.status}
      onChange={(v) => mutate({ feedId: feed._id, status: v })}
    />
  );
}
