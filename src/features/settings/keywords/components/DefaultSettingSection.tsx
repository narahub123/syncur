const DefaultSettingSection = () => {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold">기본 설정</h2>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="font-medium">피드 기본 설정</h3>

          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" checked readOnly />
              모든 피드 보기
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" readOnly />
              키워드가 포함된 피드만 보기
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-medium">알림 기본 설정</h3>

          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" checked readOnly />
              모든 알림 받기
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" readOnly />
              키워드가 포함된 알림만 받기
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DefaultSettingSection;
