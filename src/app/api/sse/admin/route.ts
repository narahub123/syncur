import { broadcastAdmin } from "@/shared/sse/sse-broadcast";
import { adminClients } from "@/shared/sse/sse-registry";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let activeController: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(controller) {
      activeController = controller;
      adminClients.add(controller);
      console.log("ADMIN CONNECTED, Total:", adminClients.size);
      // 최초 연결 성공 메시지만 전송 (인터벌 제거)
      controller.enqueue(encoder.encode(": connected\n\n"));
    },
    cancel(reason) {
      console.log("ADMIN DISCONNECTED, Reason:", reason);
      if (activeController) {
        adminClients.delete(activeController);
      }
    },
  });

  req.signal.addEventListener("abort", () => {
    if (activeController) {
      adminClients.delete(activeController);
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
    console.log("📥 [웹 서버] 어드민 라우터 내부 POST 채널로 크론 알림 접수!");

    broadcastAdmin(body);

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
