"use client";
import { useParams } from "next/navigation";
import { useAdminNotificationDetailQuery } from "../hooks/useAdminNotificationDetailQuery";

const AdminNotificationClient = () => {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useAdminNotificationDetailQuery(id);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 1. 기본 정보 */}
      <section style={{ padding: 16, border: "1px solid #ddd" }}>
        <h2>알림 정보</h2>
        <div>제목: {data.title}</div>
        <div>내용: {data.message}</div>
        <div>타입: {data.type}</div>
        <div>생성일: {data.createdAt}</div>
      </section>

      {/* 2. 사이트 정보 */}
      <section style={{ padding: 16, border: "1px solid #ddd" }}>
        <h2>사이트</h2>

        {data.site ? (
          <>
            <div>이름: {data.site.name}</div>
            <div>URL: {data.site.url}</div>
            <div>Favicon: {data.site.faviconUrl ?? "-"}</div>
          </>
        ) : (
          <div>연결된 사이트 없음</div>
        )}
      </section>

      {/* 3. 실행 로그 */}
      <section style={{ padding: 16, border: "1px solid #ddd" }}>
        <h2>실행 로그</h2>

        {data.feedExecutionLog ? (
          <>
            <div>executionId: {data.feedExecutionLog.executionId}</div>
            <div>status: {data.feedExecutionLog.status}</div>
            <div>reason: {data.feedExecutionLog.reason ?? "-"}</div>
            <div>
              failedAtStage: {data.feedExecutionLog.failedAtStage ?? "-"}
            </div>

            <div>
              error:
              <pre>
                {JSON.stringify(data.feedExecutionLog.error ?? {}, null, 2)}
              </pre>
            </div>

            <div>startedAt: {data.feedExecutionLog.startedAt}</div>
            <div>finishedAt: {data.feedExecutionLog.finishedAt}</div>
            <div>durationMs: {data.feedExecutionLog.durationMs ?? "-"}</div>
          </>
        ) : (
          <div>실행 로그 없음</div>
        )}
      </section>
    </div>
  );
};

export default AdminNotificationClient;
