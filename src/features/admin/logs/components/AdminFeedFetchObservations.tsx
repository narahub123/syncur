import { useState, Fragment } from "react"; // 💡 Fragment 임포트
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import { FeedFetchObservationDTO } from "@/features/feed-fetch-observation/dtos/feedFetchObservationDTO";

interface AdminFeedFetchObservationsProps {
  observations?: FeedFetchObservationDTO[];
}

export const AdminFeedFetchObservations = ({
  observations = [],
}: AdminFeedFetchObservationsProps) => {
  const failedAttempts = observations.filter((o) => !o.success);
  const initialOpen =
    failedAttempts.length > 0
      ? failedAttempts[failedAttempts.length - 1].attempt
      : null;
  const [expandedAttempt, setExpandedAttempt] = useState<number | null>(
    initialOpen,
  );

  if (!observations || observations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            HTTP 요청 관측 데이터 (Telemetry)
          </CardTitle>
          <CardDescription>
            이 실행 컨텍스트에서 수집된 세부 네트워크 시도 기록이 없습니다.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const sortedObservations = [...observations].sort(
    (a, b) => a.attempt - b.attempt,
  );

  const formatDateTime = (dateValue: string | Date | number) => {
    try {
      return new Date(dateValue).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          HTTP 요청 관측 데이터 (Telemetry)
        </CardTitle>
        <CardDescription>
          총{" "}
          <span className="text-foreground font-semibold">
            {observations.length}회
          </span>
          의 순차적 요청 시도가 감지되었습니다.
          <span className="text-muted-foreground mt-1 block text-xs">
            💡 실패한 행을 클릭하면 상세 에러 로그를 넓게 볼 수 있습니다.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
              <tr>
                <th className="w-20 p-4 text-center">시도</th>
                <th className="w-28 p-4">결과</th>
                <th className="w-28 p-4 text-right">소요 시간</th>
                <th className="hidden p-4 md:table-cell">시작 / 종료 시각</th>
                <th className="p-4">에러 코드</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedObservations.map((obs) => {
                const isLast = obs.attempt === observations.length - 1;
                const isExpanded = expandedAttempt === obs.attempt;

                let badgeVariant:
                  | "default"
                  | "secondary"
                  | "destructive"
                  | "outline" = "destructive";
                let badgeLabel = "최종 실패";

                if (obs.success) {
                  badgeVariant = "default";
                  badgeLabel = "성공";
                } else if (!isLast) {
                  badgeVariant = "outline";
                  badgeLabel = "실패 (재시도)";
                }

                return (
                  // 💡 고쳐진 부분: <g> 대신 <Fragment>를 사용하여 마크업 표준 준수 및 Hydration 에러 방지
                  <Fragment key={obs._id || obs.attempt}>
                    {/* 데이터 행 */}
                    <tr
                      className={cn(
                        "transition-colors",
                        !obs.success && "hover:bg-muted/50 cursor-pointer",
                        obs.success && "bg-green-50/10 hover:bg-green-50/20",
                        !obs.success && isLast && "bg-red-50/10",
                        isExpanded && "bg-slate-50 hover:bg-slate-50",
                      )}
                      onClick={() => {
                        if (!obs.success) {
                          setExpandedAttempt(isExpanded ? null : obs.attempt);
                        }
                      }}
                    >
                      <td className="text-muted-foreground p-4 text-center font-mono font-bold">
                        #{obs.attempt + 1}
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={badgeVariant}
                          className={cn(
                            badgeLabel === "실패 (재시도)" &&
                              "border-amber-500 bg-amber-50/50 text-amber-600",
                          )}
                        >
                          {badgeLabel}
                        </Badge>
                      </td>

                      <td className="p-4 text-right font-mono font-medium">
                        <span
                          className={cn(
                            obs.durationMs > 4000
                              ? "font-bold text-amber-600"
                              : "",
                          )}
                        >
                          {obs.durationMs.toLocaleString()} ms
                        </span>
                      </td>

                      <td className="text-muted-foreground hidden p-4 font-mono text-xs md:table-cell">
                        <div>시작: {formatDateTime(obs.startTime)}</div>
                        <div>종료: {formatDateTime(obs.endTime)}</div>
                      </td>

                      <td className="p-4 font-mono text-xs font-semibold">
                        {!obs.success ? (
                          <div className="flex items-center gap-2">
                            <span className="rounded border border-red-200 bg-red-100 px-1.5 py-0.5 text-red-800">
                              {obs.errorCode || "UNKNOWN"}
                            </span>
                            <span className="text-muted-foreground text-xs font-normal">
                              {isExpanded ? "▲ 접기" : "▼ 상세보기"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>

                    {/* 펼쳐지는 에러 메시지 상세 영역 */}
                    {!obs.success && isExpanded && (
                      <tr className="bg-slate-50/80">
                        <td colSpan={5} className="border-t border-b p-4">
                          <div className="rounded-md border border-red-100 bg-red-50/30 p-4">
                            <p className="mb-2 font-sans text-xs font-bold text-red-800">
                              # {obs.attempt + 1}차 시도 세부 에러 메시지
                            </p>
                            <pre className="max-h-60 overflow-y-auto rounded border border-red-100 bg-white p-3 font-mono text-xs break-all whitespace-pre-wrap text-red-900 shadow-sm">
                              {obs.errorMessage ||
                                "상세 에러 메시지가 비어있습니다."}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
