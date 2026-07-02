interface KeywordItemProps {
  keyword: string;
  targets: string[];
}

const subscriptions = ["전체", "GitHub", "Velog", "Reddit"];

// TODO: 수정 버튼 클릭 시 편집 모드로 전환
const isEditing = false;

const KeywordItem = ({ keyword, targets }: KeywordItemProps) => {
  return (
    <div className="rounded-lg border p-4">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{keyword}</h3>

            <p className="text-muted-foreground mt-1 text-sm">
              적용할 피드를 선택하세요.
            </p>
          </div>

          {/* TODO: MultiSelect 컴포넌트로 교체 */}
          <select
            multiple
            defaultValue={targets}
            className="h-32 w-full rounded-md border px-3 py-2"
          >
            {subscriptions.map((subscription) => (
              <option key={subscription} value={subscription}>
                {subscription}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            {/* TODO: 편집 내용 초기화 */}
            <button className="rounded-md border px-3 py-1.5 text-sm">
              취소
            </button>

            {/* TODO: 적용 대상 저장 */}
            <button className="rounded-md border px-3 py-1.5 text-sm">
              저장
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{keyword}</div>

            <div className="text-muted-foreground mt-1 text-sm">
              적용 대상 : {targets.join(", ")}
            </div>
          </div>

          <div className="flex gap-2">
            {/* TODO: 편집 모드 진입 */}
            <button className="rounded-md border px-3 py-1.5 text-sm">
              수정
            </button>

            {/* TODO: 키워드 삭제 */}
            <button className="rounded-md border px-3 py-1.5 text-sm text-red-500">
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordItem;
