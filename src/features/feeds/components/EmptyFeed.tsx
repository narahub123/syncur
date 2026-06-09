const EmptyFeed = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6">
      <p className="text-sm text-gray-500">아직 새로운 피드가 없습니다.</p>

      <p className="text-xs text-gray-400">
        구독한 사이트에서 새 글이 올라오면 자동으로 표시됩니다.
      </p>
    </div>
  );
};

export default EmptyFeed;
