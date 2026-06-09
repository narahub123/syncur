const EmptyBookmarks = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6">
      <p className="text-sm text-gray-500">아직 새로운 북마크가 없습니다.</p>

      <p className="text-xs text-gray-400">
        피드에서 북마크를 눌러서 저장해보세요
      </p>
    </div>
  );
};

export default EmptyBookmarks;
