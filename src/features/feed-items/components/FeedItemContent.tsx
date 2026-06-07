import { FeedItemContentDto } from "@/features/feeds/dto/feedDto";
import Link from "next/link";

type Props = {
  item: FeedItemContentDto;
};

const FeedItemContent = ({ item }: Props) => {
  const { title, description, link } = item;
  return (
    <Link href={link} target="_blank">
      <div className="space-y-1">
        <p className="text-md line-clamp-1 font-medium">{title}</p>
        <p className="text-md line-clamp-3 break-after-all">{description}</p>
      </div>
    </Link>
  );
};

export default FeedItemContent;
