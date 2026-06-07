type Props = {
  categories: string[];
};

const FeedItemCategories = ({ categories }: Props) => {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category}>{category}</li>
      ))}
    </ul>
  );
};

export default FeedItemCategories;
