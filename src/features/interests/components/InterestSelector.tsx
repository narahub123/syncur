import { InterestDTO } from "../dtos/interestDto";
import { Interest, InterestCategory } from "../types/interests";
import InterestButton from "./InterestButton";

type InterestSelectorProps = {
  categories: InterestCategory[];
  selectedInterests: InterestDTO[];
  onSelect: (value: InterestDTO) => void;
};

const InterestSelector = ({
  categories,
  selectedInterests,
  onSelect,
}: InterestSelectorProps) => {
  if (categories.length === 0) return null;

  return (
    <ul className="space-y-4">
      {categories.map((category) => (
        <li key={category.id} className="space-y-2">
          <h3 className="font-medium">{category.name}</h3>
          <div>
            <ul className="flex flex-wrap gap-2">
              {category.interests.map((interest) => {
                const isSelected = selectedInterests.some(
                  (selectedInterest) => selectedInterest._id === interest._id,
                );

                return (
                  <li key={interest._id}>
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
  );
};

export default InterestSelector;
