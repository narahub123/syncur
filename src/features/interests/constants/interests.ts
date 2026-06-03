import { InterestCategory } from "../types/interests";

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: "it",
    name: "IT",
    interests: [
      { id: "ai", name: "AI" },
      { id: "backend", name: "백엔드" },
      { id: "frontend", name: "프론트엔드" },
      { id: "mobile", name: "모바일" },
      { id: "cloud", name: "클라우드" },
      { id: "devops", name: "DevOps" },
      { id: "database", name: "데이터베이스" },
      { id: "security", name: "보안" },
      { id: "opensource", name: "오픈소스" },
    ],
  },
  {
    id: "business",
    name: "비즈니스",
    interests: [
      { id: "startup", name: "스타트업" },
      { id: "marketing", name: "마케팅" },
      { id: "career", name: "커리어" },
    ],
  },
  {
    id: "economy",
    name: "경제",
    interests: [
      { id: "stock", name: "주식" },
      { id: "investment", name: "투자" },
      { id: "finance", name: "금융" },
    ],
  },
  {
    id: "life",
    name: "라이프",
    interests: [
      { id: "productivity", name: "생산성" },
      { id: "self-development", name: "자기계발" },
      { id: "health", name: "건강" },
    ],
  },
];
