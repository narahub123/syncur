"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/components/ui/combobox";

import { useSearchCollectionsQuery } from "../hooks/useSearchCollectionsQuery";
import { BOOKMARK_COLLECTION_CONFIG } from "../constants/bookmark-collection-config";

type Props = {
  value: string;

  onValueChange: (value: string) => void;

  onSelectCollection: (collectionId: string, collectionName: string) => void;
};

export default function CollectionInput({
  value,
  onValueChange,
  onSelectCollection,
}: Props) {
  const result = useSearchCollectionsQuery({
    keyword: value,
    limit: BOOKMARK_COLLECTION_CONFIG.BOOKMARK_COLLECTION_SEARCH_LIMIT,
  });

  return (
    <Combobox
      items={[...(result.data?.user ?? []), ...(result.data?.global ?? [])]}
    >
      <ComboboxInput
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="컬렉션 검색 또는 생성"
      />

      <ComboboxContent>
        <ComboboxList>
          <ComboboxEmpty>검색 결과가 없습니다.</ComboboxEmpty>

          {result.data?.user?.length ? (
            <>
              <div className="text-muted-foreground px-2 py-1 text-xs font-medium">
                내 컬렉션
              </div>

              {result.data.user.map((collection) => (
                <ComboboxItem
                  key={collection._id}
                  value={collection.name}
                  onClick={() =>
                    onSelectCollection(collection._id, collection.name)
                  }
                >
                  {collection.name}
                </ComboboxItem>
              ))}
            </>
          ) : null}

          {result.data?.global?.length ? (
            <>
              <div className="text-muted-foreground px-2 py-1 text-xs font-medium">
                추천 컬렉션
              </div>

              {result.data.global.map((collection) => (
                <ComboboxItem
                  key={`global-${collection._id}`}
                  value={collection.name}
                  onClick={() =>
                    onSelectCollection(collection._id, collection.name)
                  }
                >
                  {collection.name}
                </ComboboxItem>
              ))}
            </>
          ) : null}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
