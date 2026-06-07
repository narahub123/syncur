import { FeedItemMetaDto } from "@/features/feeds/dto/feedDto";
import { formatFeedPublishedTime } from "@/shared/utils/date";
import Link from "next/link";

type Props = {
  meta: FeedItemMetaDto;
};

const FeedSourceCard = ({ meta }: Props) => {
  const { site, publishedAt } = meta;
  const { favicon_url, name, url } = site;

  const { display, full } = formatFeedPublishedTime(publishedAt);

  return (
    <div className="flex items-center gap-1">
      <Link href={url} className="flex items-center gap-1" target="_blank">
        <img
          src={favicon_url ?? ""}
          alt=""
          className={"h-8 w-8 rounded-full object-contain"}
        />
        <span className="text-sm font-medium">{name}</span>
      </Link>
      <span title={full} className="text-xs">
        {display}
      </span>
    </div>
  );
};

export default FeedSourceCard;
