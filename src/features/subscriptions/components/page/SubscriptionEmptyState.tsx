import SiteSubscriptionForm from "../SiteSubscriptionForm";

const SubscriptionEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-2 text-sm text-gray-500">
        아직 구독 중인 사이트가 없습니다
      </div>

      <div className="mb-6 text-xs text-gray-400">
        관심 있는 사이트를 구독하면 최신 글을 모아볼 수 있습니다
      </div>

      <section className="w-full p-4">
        <SiteSubscriptionForm />
      </section>

      {/* 인기 페이지를 구현하면 이동하는 버튼 추가할 것 */}
      {/* <Link
        href="/discover"
        className="rounded-md bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
      >
        사이트 탐색하기
      </Link> */}
    </div>
  );
};

export default SubscriptionEmptyState;
