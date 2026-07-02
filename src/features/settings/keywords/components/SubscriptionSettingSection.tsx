import { ROUTES } from "@/shared/constants/routes";
import Link from "next/link";

const subscriptions = [
  {
    subscriptionId: "sub_1",
    name: "GitHub",
  },
  {
    subscriptionId: "sub_2",
    name: "Velog",
  },
  {
    subscriptionId: "sub_3",
    name: "Medium",
  },
  {
    subscriptionId: "sub_4",
    name: "Hacker News",
  },
];

const SubscriptionSettingSection = () => {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold">구독별 설정</h2>

      <p className="text-muted-foreground mt-2 text-sm">
        특정 구독에만 기본 설정과 다른 정책을 적용할 수 있습니다.
      </p>

      <div className="mt-6 divide-y rounded-md border">
        {subscriptions.map((subscription) => (
          <Link
            href={`${ROUTES.SETTINGS_SUBSCRIPTIONS}/${subscription.subscriptionId}`}
            key={subscription.subscriptionId}
            className="hover:bg-muted/50 flex w-full items-center justify-between px-4 py-4 text-left"
          >
            <span>{subscription.name}</span>

            <span>〉</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SubscriptionSettingSection;
