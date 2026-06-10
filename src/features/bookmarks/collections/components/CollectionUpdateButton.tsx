import { cn } from "@/shared/utils/cn";
import { BookmarkCollectionResponse } from "../../dto/bookmarkDto";
import { useCollectionDialogStore } from "../../stores/useCollectionDialogStore";

type Props = {
  collection: BookmarkCollectionResponse | null;
  feedItemId: string;
};

// 클릭 시 같은 카테고리의 글을 읽을 수 있게 해야 하는데 자신의 것만? 다른 사람의 것도?
// 컬렉션이 없는 경우에는 컬렉션을 추가할 수 있게 함
const CollectionUpdateButton = ({ collection, feedItemId }: Props) => {
  const openDialog = useCollectionDialogStore((s) => s.openDialog);
  const handleOpenClick = () => {
    openDialog(feedItemId, collection);
  };

  return (
    <button
      className={cn(
        "cursor-pointer text-xs",
        collection ? "text-blue-400" : "text-red-400",
      )}
      onClick={handleOpenClick}
    >
      {collection ? collection.collectionName : "컬렉션 추가"}
    </button>
  );
};

export default CollectionUpdateButton;
