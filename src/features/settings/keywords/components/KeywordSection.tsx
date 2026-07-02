import { SubscriptionItemDto } from "@/features/subscriptions/dto/subscriptionDto";
import KeywordCreateForm from "./KeywordCreateForm";
import KeywordList from "./KeywordList";
import { PaginatedResponse } from "@/shared/types/pagination";

type Props = {
  data: PaginatedResponse<SubscriptionItemDto>;
};

const KeywordSection = ({ data }: Props) => {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold">키워드</h2>

      <p className="text-muted-foreground mt-2 text-sm">
        키워드를 등록하고 적용할 피드를 선택합니다.
      </p>

      <KeywordCreateForm data={data} />

      <KeywordList />
    </section>
  );
};

export default KeywordSection;
