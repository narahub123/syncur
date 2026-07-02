import KeywordItem from "./KeywordItem";

const keywords = [
  {
    keyword: "React",
    targets: ["전체"],
  },
  {
    keyword: "AI",
    targets: ["GitHub", "Velog"],
  },
  {
    keyword: "Next.js",
    targets: ["Reddit"],
  },
];

const KeywordList = () => {
  return (
    <div className="mt-8 space-y-3">
      {keywords.map((item) => (
        <KeywordItem
          key={item.keyword}
          keyword={item.keyword}
          targets={item.targets}
        />
      ))}
    </div>
  );
};

export default KeywordList;
