import { SORT_ORDER, SortOrder } from "@/shared/types/pagination";

/**
 * 테이블 정렬 로직을 공통화하기 위한 훅입니다.
 * * @template T - 테이블에 표시될 데이터 모델의 타입 (예: Notice, User)
 * - sort 키가 이 모델의 필드 이름(keyof T)과 일치해야 하므로 필요합니다.
 * * @template Q - 페이지에서 관리하는 쿼리(Query) 객체의 타입
 * - 이 타입은 반드시 sort와 sortOrder 필드를 포함하는 SortableQuery<T>를 상속받아야 합니다.
 * * @param query - 현재 페이지의 상태(검색어, 페이지 번호 등)를 포함한 쿼리 객체
 * @param onChange - 쿼리 객체를 업데이트하는 상태 변경 함수 (예: setQuery)
 */
interface SortableQuery<T> {
  sort: T;
  sortOrder: SortOrder;
}

export const useTableSort = <Q extends SortableQuery<K>, K extends string>(
  query: Q,
  onChange: (q: Q) => void,
) => {
  // onSort는 이제 K 타입(우리가 정의한 정렬 상수들)만 받습니다.
  const onSort = (key: K) => {
    const isSameKey = query.sort === key;

    const nextOrder =
      isSameKey && query.sortOrder === SORT_ORDER.DESC ? "desc" : "asc";

    onChange({
      ...query,
      sort: key,
      sortOrder: nextOrder,
    } as Q);
  };

  return {
    onSort,
    sort: {
      key: query.sort,
      order: query.sortOrder,
    },
  };
};
