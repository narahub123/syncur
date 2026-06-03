import { Interest, InterestCategory } from "../types/interests";
import InterestButton from "./InterestButton";

type InterestSelectorProps = {
  categories: InterestCategory[];
  selectedInterests: Interest[];
  onSelect: (value: Interest) => void;
};

const InterestSelector = ({
  categories,
  selectedInterests,
  onSelect,
}: InterestSelectorProps) => {
  if (categories.length === 0) return null;

  return (
    <div>
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.id} className="space-y-2">
            <h3 className="font-medium">{category.name}</h3>
            <div>
              <ul className="flex flex-wrap gap-2">
                {category.interests.map((interest) => {
                  const isSelected = selectedInterests.some(
                    (selectedInterest) => selectedInterest.id === interest.id,
                  );

                  return (
                    <li key={interest.id}>
                      <InterestButton
                        interest={interest}
                        onClick={() => onSelect(interest)}
                        isSelected={isSelected}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterestSelector;
