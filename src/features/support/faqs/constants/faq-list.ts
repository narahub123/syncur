import { Faq } from "../types";

export const FAQS: Faq[] = [
  {
    value: "add-feed",
    question: "피드는 어떻게 추가하나요?",
    answer:
      "사이트 상세 페이지에서 RSS URL을 등록하거나 지원되는 사이트의 피드를 추가할 수 있습니다.",
  },
  {
    value: "notification-not-working",
    question: "알림이 오지 않습니다.",
    answer:
      "알림 설정이 활성화되어 있는지 확인하고, 브라우저 알림 권한이 허용되어 있는지 확인해주세요.",
  },
  {
    value: "feed-update-interval",
    question: "피드는 얼마나 자주 확인되나요?",
    answer:
      "피드 확인 주기는 시스템 설정에 따라 달라질 수 있으며, 일반적으로 일정 주기마다 자동으로 수집됩니다.",
  },
  {
    value: "duplicate-notifications",
    question: "같은 알림이 여러 번 도착합니다.",
    answer:
      "중복 게시글 감지 설정이나 피드 원본 데이터 상태에 따라 발생할 수 있습니다. 문제가 지속되면 오류 신고를 이용해주세요.",
  },
  {
    value: "feed-error",
    question: "피드 수집이 실패했습니다.",
    answer:
      "RSS 주소가 변경되었거나 사이트 접근에 문제가 있을 수 있습니다. 잠시 후 다시 시도하거나 오류 신고를 이용해주세요.",
  },
  {
    value: "delete-feed",
    question: "등록한 피드를 삭제할 수 있나요?",
    answer:
      "네. 피드 상세 페이지에서 삭제 기능을 통해 언제든지 제거할 수 있습니다.",
  },
  {
    value: "notification-history",
    question: "지난 알림은 어디서 확인할 수 있나요?",
    answer: "알림 페이지에서 이전에 수신한 알림 목록을 확인할 수 있습니다.",
  },
  {
    value: "report-bug",
    question: "서비스 오류는 어떻게 신고하나요?",
    answer:
      "고객 지원의 '오류 신고' 메뉴를 통해 발생한 문제를 상세히 제보할 수 있습니다.",
  },
];
