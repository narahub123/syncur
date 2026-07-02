const subscriptions = ["전체", "GitHub", "Velog", "Reddit"];

const KeywordCreateForm = () => {
  return (
    <div className="mt-6 flex gap-2">
      <input
        className="flex-1 rounded-md border px-3 py-2"
        placeholder="키워드를 입력하세요."
      />

      <select className="w-48 rounded-md border px-3 py-2">
        {subscriptions.map((subscription) => (
          <option key={subscription}>{subscription}</option>
        ))}
      </select>

      <button className="rounded-md border px-4 py-2">추가</button>
    </div>
  );
};

export default KeywordCreateForm;
