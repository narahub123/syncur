// 1. 글로벌 컨텍스트 싱글톤 인터페이스 정의
interface GlobalSSEStorage {
  userClients?: Set<ReadableStreamDefaultController>;
  adminClients?: Set<ReadableStreamDefaultController>;
  cleanerInitialized?: boolean;
}

// 2. Node.js global 객체를 안전하게 가져옴
const globalRef = (globalThis || global) as unknown as GlobalSSEStorage;

// 3. 💡 핵심: 핫 리로드나 모듈 격리가 일어나도 전역 메모리에 박힌 기존 Set 주소를 무조건 재사용
if (!globalRef.userClients) {
  globalRef.userClients = new Set<ReadableStreamDefaultController>();
}
if (!globalRef.adminClients) {
  globalRef.adminClients = new Set<ReadableStreamDefaultController>();
}

// 명시적으로 싱글톤 인스턴스 참조 상수로 고정
export const userClients: Set<ReadableStreamDefaultController> =
  globalRef.userClients;
export const adminClients: Set<ReadableStreamDefaultController> =
  globalRef.adminClients;

// 4. 좀비 커넥션 청소 루프 (중복 생성 방지 가드)
if (!globalRef.cleanerInitialized) {
  const encoder = new TextEncoder();
  const pingPayload = encoder.encode(": ping\n\n");

  setInterval(() => {
    userClients.forEach((controller) => {
      try {
        controller.enqueue(pingPayload);
      } catch {
        userClients.delete(controller);
      }
    });

    adminClients.forEach((controller) => {
      try {
        controller.enqueue(pingPayload);
      } catch {
        adminClients.delete(controller);
      }
    });
  }, 15000); // 15초 주기

  globalRef.cleanerInitialized = true;
}
