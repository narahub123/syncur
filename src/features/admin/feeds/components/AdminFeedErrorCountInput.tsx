"use client";

import { FeedWithSiteDto } from "@/features/feeds/dto/feedDto";
import { useUpdateFeedErrorCount } from "../hooks/useUpdateFeedErrorCountMutation";
import FeedErrorCountInput from "./FeedErrorCountInput";

type Props = {
  feed: FeedWithSiteDto;
};

export default function AdminFeedErrorCountInput({ feed }: Props) {
  const { mutate } = useUpdateFeedErrorCount();

  return (
    <FeedErrorCountInput
      value={feed.errorCount}
      max={feed.errorCount}
      onSubmit={(value) =>
        mutate({
          feedId: feed._id,
          errorCount: value,
        })
      }
    />
  );
}
