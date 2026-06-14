"use client";

import { useParams } from "next/navigation";
import { useAdminFeedExecutionLogDetailQuery } from "../hooks/useAdminFeedExecutionLogDetailQuery";

const AdminFeedExcutionLogClient = () => {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useAdminFeedExecutionLogDetailQuery(id);
  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 1. 수집 실행 로그 핵심 정보 (주인공 데이터) */}
      <section style={{ padding: 16, border: "1px solid #ddd" }}>
        <h2>실행 로그 정보</h2>
        <div>실행 식별자(executionId): {data.executionId ?? "-"}</div>
        <div>상태(status): {data.status}</div>
        <div>실패 단계(failedAtStage): {data.failedAtStage ?? "-"}</div>
        <div>실패 사유(reason): {data.reason ?? "-"}</div>
        <div>소요 시간(durationMs): {data.durationMs ?? 0}ms</div>
        <div>시작 시간(startedAt): {String(data.startedAt)}</div>
        <div>종료 시간(finishedAt): {String(data.finishedAt)}</div>
        <div>생성일(createdAt): {String(data.createdAt)}</div>
        <div>수정일(updatedAt): {String(data.updatedAt)}</div>
      </section>

      {/* 2. 조인된 사이트 정보 */}
      <section style={{ padding: 16, border: "1px solid #ddd" }}>
        <h2>연결된 사이트</h2>
        {data.site ? (
          <>
            <div>사이트 이름: {data.site.name}</div>
            <div>사이트 URL: {data.site.url}</div>
            {/* 💡 기존 faviconUrl 수동 검증 오탈자를 DTO 규격인 favicon_url 로 수정 */}
            <div>Favicon: {data.site.faviconUrl ?? "-"}</div>
          </>
        ) : (
          <div>연결된 사이트 정보 없음</div>
        )}
      </section>

      {/* 3. 조인된 피드 정보 */}
      <section style={{ padding: 16, border: "1px solid #ddd" }}>
        <h2>연결된 RSS 피드</h2>
        {data.feed ? (
          <>
            <div>피드 식별자(_id): {String(data.feed._id)}</div>
            {/* 💡 기존 feedUrl DTO 규격 매핑 적용 */}
            <div>RSS 주소(feedUrl): {data.feed.feedUrl}</div>
            <div>피드 상태(status): {data.feed.status}</div>
          </>
        ) : (
          <div>연결된 피드 정보 없음</div>
        )}
      </section>

      {/* 4. 에러 스택 상세 정보 */}
      <section
        style={{
          padding: 16,
          border: "1px solid #ddd",
          backgroundColor: "#fff5f5",
        }}
      >
        <h2>상세 에러 로그 (디버깅용)</h2>
        {data.error ? (
          <div style={{ marginTop: 8 }}>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                padding: 12,
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                borderRadius: 4,
              }}
            >
              {/* 에러 데이터가 객체이든 문자열이든 안전하게 가드 출력 */}
              {typeof data.error === "object"
                ? JSON.stringify(data.error, null, 2)
                : data.error}
            </pre>
          </div>
        ) : (
          <div style={{ color: "#16a34a" }}>터진 에러 없음 (정상 가동)</div>
        )}
      </section>
    </div>
  );
};

export default AdminFeedExcutionLogClient;
