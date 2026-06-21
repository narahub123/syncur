"use client";

import { useMemo, useState } from "react";
import {
  InterestModalErrorCode,
  MAX_INTEREST_COUNT,
  MIN_INTEREST_COUNT,
} from "../constants/interest-selection-modal";
import InterestActionBar from "./InterestActionBar";
import SettingsPageHeader from "../../settings/components/SettingsPageHeader";
import InterestSelector from "./InterestSelector";

import { UserInterestProfilePopulatedDTO } from "../dtos/userInterestProfileDto";
import { InterestDTO } from "../dtos/interestDto";

type InterestClientProps = {
  interests: UserInterestProfilePopulatedDTO | null;
};

const isSameInterestIds = (prev: InterestDTO[], next: InterestDTO[]) => {
  if (prev.length !== next.length) return false;

  const prevIdSet = new Set(prev.map((interest) => interest._id));

  return next.every((interest) => prevIdSet.has(interest._id));
};

const InterestClient = ({ interests }: InterestClientProps) => {
  const [selectedInterests, setSelectedInterests] = useState<InterestDTO[]>(
    interests?.interests ?? [],
  );
  const [errorCode, setErrorCode] = useState<InterestModalErrorCode | null>(
    null,
  );

  const isChanged = useMemo(
    () => !isSameInterestIds(interests?.interests || [], selectedInterests),
    [interests, selectedInterests],
  );

  const handleToggleInterest = (interest: InterestDTO) => {
    const isSelected = selectedInterests.some(
      (item) => item._id === interest._id,
    );

    if (selectedInterests.length >= MAX_INTEREST_COUNT && !isSelected) {
      setErrorCode("EXCEED");
      return;
    }

    const nextSelectedInterests = isSelected
      ? selectedInterests.filter((item) => item._id !== interest._id)
      : [...selectedInterests, interest];

    setSelectedInterests(nextSelectedInterests);

    if (nextSelectedInterests.length < MIN_INTEREST_COUNT) {
      setErrorCode("INSUFFICIENT");
      return;
    }

    setErrorCode(null);
  };

  return (
    <main className="h-[calc(100vh-50px)] min-h-0 flex-1 overflow-y-auto">
      <SettingsPageHeader
        title="관심사 관리"
        description="추천 피드를 개선하기 위해 관심 있는 주제를 수정해주세요."
      />

      <section className="min-h-0 p-6">
        <InterestSelector
          categories={[]}
          selectedInterests={selectedInterests}
          onSelect={handleToggleInterest}
        />
      </section>
      <InterestActionBar
        selectedCount={selectedInterests.length}
        errorCode={errorCode}
        disabled={selectedInterests.length < MIN_INTEREST_COUNT || !isChanged}
        selectedInterests={selectedInterests}
      />
    </main>
  );
};

export default InterestClient;
