import mongoose from "mongoose";

/**
 * MongoDB 연결 캐시.
 *
 * 목적:
 * - Next.js 개발 환경의 HMR(Hot Module Replacement)로 인해
 *   파일이 여러 번 재실행되더라도 MongoDB 연결을 재사용한다.
 * - 불필요한 중복 연결 생성을 방지한다.
 *
 * conn:
 * - 연결이 완료된 mongoose 인스턴스
 *
 * promise:
 * - 연결 진행 중인 Promise
 * - 동시에 여러 요청이 들어와도 하나의 연결만 생성하도록 사용한다.
 */
const globalForMongoose = globalThis as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cached = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongoose = cached;

/**
 * MongoDB 연결을 반환한다.
 *
 * 동작 순서:
 * 1. 이미 연결된 경우 기존 연결을 재사용한다.
 * 2. 연결이 없으면 환경 변수에서 MONGODB_URI를 조회한다.
 * 3. 최초 한 번만 mongoose.connect()를 실행한다.
 * 4. 연결 완료 후 캐시에 저장한다.
 * 5. 이후 요청에서는 동일한 연결을 반환한다.
 */
export async function connectMongo() {
  /**
   * 이미 연결된 경우 기존 연결 반환
   */
  if (cached.conn) {
    return cached.conn;
  }

  const mongodbUri = process.env.MONGODB_URI;

  /**
   * MongoDB 연결 문자열이 없는 경우
   */
  if (!mongodbUri) {
    throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
  }

  /**
   * 연결이 진행 중이 아니라면 새 연결 생성
   *
   * ??= 연산자를 사용하여
   * Promise가 없는 경우에만 mongoose.connect()를 실행한다.
   */
  cached.promise ??= mongoose.connect(mongodbUri);

  /**
   * 연결 완료 후 캐시에 저장
   */
  cached.conn = await cached.promise;

  return cached.conn;
}
