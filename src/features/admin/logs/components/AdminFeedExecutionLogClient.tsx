"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminFeedExecutionLogDetailQuery } from "../hooks/useAdminFeedExecutionLogDetailQuery";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  FEED_EXECUTION_REASON_KR,
  FEED_EXECUTION_STAGE_KR,
  FEED_EXECUTION_STATUS,
  FEED_EXECUTION_STATUS_KR,
} from "../types/search";
import { Avatar } from "@/shared/components/common/Avartar";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { AdminFeedExecutionLogSkeleton } from "./AdminFeedExecutionLogSkeleton";
import { useEffect } from "react";
import { EmptyState, ErrorState } from "../../components/AdminState";
import { ROUTES } from "@/shared/constants/routes";
import { FEED_EXECUTION_LOG_CONFIG } from "../constants/log-config";
import { AdminBackButton } from "../../components/AdminBackButton";

const AdminFeedExcutionLogClient = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading, error } = useAdminFeedExecutionLogDetailQuery(id);

  // 데이터 없음 시 3초 후 목록 이동
  useEffect(() => {
    if (!isLoading && !data && !error) {
      const timer = setTimeout(() => {
        router.push(`${ROUTES.ADMIN_LOGS}`); // 목록 페이지 경로
      }, FEED_EXECUTION_LOG_CONFIG.PAGE_TIMEOUT * 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, data, error, router]);

  if (isLoading) return <AdminFeedExecutionLogSkeleton />;

  if (error) return <ErrorState />;

  if (!data)
    return (
      <EmptyState
        message={`데이터를 찾을 수 없습니다. ${FEED_EXECUTION_LOG_CONFIG.PAGE_TIMEOUT}초 후 목록으로 이동합니다.`}
      />
    );

  // 상태에 따른 배지 스타일 결정
  const getStatusVariant = (status: string) => {
    switch (status) {
      case FEED_EXECUTION_STATUS.SUCCESS:
        return "default";

      case FEED_EXECUTION_STATUS.SKIPPED:
        return "secondary";

      case FEED_EXECUTION_STATUS.RUNNING:
        return "outline"; // 진행 중은 강조되지 않게 outline

      case FEED_EXECUTION_STATUS.FAILED:
      case FEED_EXECUTION_STATUS.PARTIAL_SUCCESS:
      default:
        return "destructive"; // 실패 및 기타 예외 상황
    }
  };

  const isFailed =
    data.status === FEED_EXECUTION_STATUS.FAILED ||
    data.status === FEED_EXECUTION_STATUS.PARTIAL_SUCCESS;

  return (
    <div className="w-full space-y-6 p-6">
      <AdminBackButton href={`${ROUTES.ADMIN_LOGS}`} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">실행 로그 상세</h1>
        <Badge variant={getStatusVariant(data.status)} className="p-3 text-sm">
          {FEED_EXECUTION_STATUS_KR[data.status]}
        </Badge>
      </div>

      {/* 1. 핵심 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>실행 로그 정보</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            { label: "Execution ID", value: data.executionId },
            { label: "소요 시간", value: `${data.durationMs}ms` },
            {
              label: "시작 시간",
              value: new Date(data.startedAt).toLocaleString(),
            },
            {
              label: "종료 시간",
              value: data.finishedAt
                ? new Date(data.finishedAt).toLocaleString()
                : "-",
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-muted-foreground text-sm">{item.label}</p>
              <p className="truncate font-medium">{item.value}</p>
            </div>
          ))}

          {/* 실패 정보 섹션 (항상 노출, 단 내용이 없으면 '없음'으로 표시) */}
          <div
            className={cn(
              "col-span-1 rounded-lg border bg-gray-50 p-4 sm:col-span-2",
              isFailed ? "bg-red-100" : "border-gray-100",
            )}
          >
            <p className="mb-1 font-semibold text-gray-700">실패 정보</p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">단계:</span>{" "}
              {!data.failedAtStage
                ? "없음 (정상)"
                : FEED_EXECUTION_STAGE_KR[data.failedAtStage]}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">사유:</span>{" "}
              {!data.reason ? "없음" : FEED_EXECUTION_REASON_KR[data.reason]}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2 & 3. 조인 정보 (좌우 배치) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>연결된 사이트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.site ? (
              <>
                <p className="flex items-center">
                  <span className="text-muted-foreground">이름:</span>
                  <Avatar
                    src={data.site.faviconUrl}
                    imgProps={{ className: "w-6 h-6" }}
                  />
                  {data.site.name}
                </p>
                <p className="flex gap-2 truncate">
                  <span className="text-muted-foreground">URL:</span>
                  <Link href={data.site.url}>{data.site.url}</Link>
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">정보 없음</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>연결된 RSS 피드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.feed ? (
              <>
                <p>
                  <span className="text-muted-foreground">ID:</span>{" "}
                  {data.feed._id}
                </p>
                <p className="truncate text-sm">
                  <span className="text-muted-foreground">주소:</span>{" "}
                  {data.feed.feedUrl}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">정보 없음</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. 에러 로그 */}
      {/* 에러 데이터가 있을 때만 노출 */}
      {data.error && (
        <Card className={cn(isFailed ? "bg-red-50/50" : "bg-gray-50/50")}>
          <CardHeader>
            <CardTitle
              className={cn(
                "text-lg",
                isFailed ? "text-red-800" : "text-gray-800",
              )}
            >
              {isFailed ? "상세 에러 로그" : "상세 로그"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre
              className={cn(
                "overflow-x-auto rounded-md border p-4 text-sm",
                isFailed
                  ? "border-red-200 bg-red-100 text-red-900"
                  : "border-gray-200 bg-gray-100 text-gray-900",
              )}
            >
              {typeof data.error === "object"
                ? JSON.stringify(data.error, null, 2)
                : data.error}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminFeedExcutionLogClient;
