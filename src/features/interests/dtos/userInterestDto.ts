// 1. 선택된 관심사 그룹에 대한 DTO
export interface InterestSelectionDTO {
  categoryId: string;
  interestIds: string[];
}

// 2. 사용자 관심사 전체 프로필 DTO
export interface UserInterestDTO {
  _id: string;
  userId: string;
  selections: InterestSelectionDTO[]; // 화면 렌더링에 최적화된 구조
  createdAt: string;
  updatedAt: string;
}

// 3. (옵션) 저장 요청 시 사용할 DTO (입력용)
// 클라이언트에서 서버로 데이터를 보낼 때는 ID만 배열로 보내는 것이 일반적입니다.
export interface UserInterestInputDTO {
  selections: {
    categoryId: string;
    interestIds: string[];
  }[];
}
