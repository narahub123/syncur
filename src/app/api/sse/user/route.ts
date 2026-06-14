import { broadcastUser } from "@/shared/sse/sse-broadcast";
import { userClients } from "@/shared/sse/sse-registry";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  // 외부 cancel 스코프에서 접근할 수 있도록 컨트롤러 변수 선언
  let activeController: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(controller) {
      // 1. 나중에 cancel이나 내부 클로저에서 참조할 수 있도록 전역 할당
      activeController = controller;

      // 2. 외부에서 데이터를 보낼 수 있도록 레지스트리에 유저 컨트롤러 등록
      userClients.add(controller);
      console.log("USER CONNECTED, Total:", userClients.size);

      // 3. 초기 연결 성공 메시지만 전송 (가짜 인터벌 테스트 데이터 로직 삭제)
      controller.enqueue(encoder.encode(": connected\n\n"));
    },
    cancel(reason) {
      console.log("USER DISCONNECTED, Reason:", reason);

      // 스코프 내의 activeController 변수를 활용해 안전하게 레지스트리에서 삭제
      if (activeController) {
        userClients.delete(activeController);
      }
    },
  });

  // Next.js 환경에서 브라우저 이탈(새로고침/창 닫기) 시 스트림 취소를 확실하게 보장
  req.signal.addEventListener("abort", () => {
    if (activeController) {
      userClients.delete(activeController);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 [웹 서버] 유저 라우터 내부 POST 채널로 크론 알림 접수!");

    broadcastUser(body);

    return Response.json({ success: true });
  } catch (error: unknown) {
    // error 객체가 실제 JavaScript 내장 Error 인스턴스인지 검증 (타입 좁히기)
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 서버 오류";

    console.error("❌ 어드민 브릿지 API 처리 실패:", error);

    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
