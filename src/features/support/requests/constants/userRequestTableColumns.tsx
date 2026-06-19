import { RequestResponseDTO } from "../dtos";
import { REQUEST_STATUS, REQUEST_TYPE } from "../constants/request-type";
import { UserRequestSort } from "../types/user-search";

export type UserRequestTableColumn = {
  key: UserRequestSort | string; // 정렬 키가 아닌 컬럼도 수용
  header: string;
  align?: "left" | "center" | "right";
  render: (request: RequestResponseDTO) => React.ReactNode;
};

export const userRequestTableColumns: UserRequestTableColumn[] = [
  {
    key: "status",
    header: "상태",
    align: "center",
    render: (r) => (
      <span
        className={`rounded px-2 py-0.5 text-[10px] ${
          r.status === REQUEST_STATUS.COMPLETED
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {r.status === REQUEST_STATUS.COMPLETED ? "답변완료" : "처리중"}
      </span>
    ),
  },
  {
    key: "type", // 유형별 정렬을 위해 키 추가
    header: "유형",
    align: "center",
    render: (r) => (
      <span
        className={`text-xs font-semibold ${r.type === REQUEST_TYPE.BUG_REPORT ? "text-red-600" : "text-blue-600"}`}
      >
        {r.type === REQUEST_TYPE.BUG_REPORT ? "버그" : "문의"}
      </span>
    ),
  },
  {
    key: "title",
    header: "제목",
    render: (r) => <span className="truncate font-medium">{r.title}</span>,
  },

  {
    key: "createdAt",
    header: "접수일",
    render: (r) => new Date(r.createdAt).toLocaleDateString("ko-KR"),
  },
];
