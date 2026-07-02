import { Badge } from "@/shared/components/ui/badge";
import { KeywordItemTarget } from "../dto";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";

import KeywordDeleteButton from "./KeywordDeleteButton";
import KeywordActiveToggleButton from "./KeywordActiveToggleButton";
import Link from "next/link";

interface KeywordItemProps {
  keywordId: string;
  keyword: string;
  isActive: boolean;
  targets: KeywordItemTarget[];
}

const KeywordItem = ({
  keywordId,
  keyword,
  isActive,
  targets,
}: KeywordItemProps) => {
  const router = useRouter();

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{keyword}</div>

          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1">적용 대상 :</span>

            {targets.length === 0 ? (
              <Badge variant="secondary">전체</Badge>
            ) : (
              targets.map((target) => (
                <Badge
                  key={target.subscriptionId}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `${ROUTES.SETTINGS_SUBSCRIPTIONS}/${target.subscriptionId}`,
                    )
                  }
                >
                  {target.feedName}
                </Badge>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <KeywordActiveToggleButton
            keywordId={keywordId}
            isActive={isActive}
          />
          {/* TODO: 편집 모드 진입 */}
          <Link
            className="shrink-0 rounded-md border px-3 py-1.5 text-sm"
            href={`${ROUTES.SETTINGS_KEYWORDS}/${keywordId}`}
          >
            수정
          </Link>
          {/* TODO: 키워드 삭제 */}
          <KeywordDeleteButton keywordId={keywordId} />
        </div>
      </div>
    </div>
  );
};

export default KeywordItem;
