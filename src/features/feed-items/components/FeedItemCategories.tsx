type Props = {
  categories: string[];
};

const FeedItemCategories = ({ categories }: Props) => {
  return (
    <ul className="px-4">
      {categories.map((category) => (
        <li key={category}>{category}</li>
      ))}
    </ul>
  );
};

export default FeedItemCategories;
