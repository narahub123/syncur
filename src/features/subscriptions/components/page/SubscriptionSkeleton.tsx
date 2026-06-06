const SubscriptionItemSkeleton = () => {
  return (
    <ul>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <li className="flex items-center justify-between p-2" key={item}>
          {/* left: site card */}
          <div className="flex items-center gap-2">
            {/* avatar */}
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />

            {/* text block */}
            <div className="flex flex-col gap-1">
              <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-2 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* right: toggle */}
          <div className="h-6 w-10 animate-pulse rounded-full bg-gray-200" />
        </li>
      ))}
    </ul>
  );
};

export default SubscriptionItemSkeleton;
