import { MongoClient } from "mongodb";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
}

declare global {
   
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * NextAuth MongoDB Adapter에서 사용하는 MongoDB Native Driver 클라이언트.
 *
 * 개발 환경에서는 Next.js HMR로 인해 모듈이 여러 번 재실행될 수 있다.
 * 이때 MongoClient를 매번 새로 만들면 Atlas 연결 수가 불필요하게 증가할 수 있으므로
 * globalThis에 connect promise를 캐싱해 재사용한다.
 */
const clientPromise =
  globalThis.mongoClientPromise ?? new MongoClient(mongodbUri).connect();

if (process.env.NODE_ENV !== "production") {
  globalThis.mongoClientPromise = clientPromise;
}

export default clientPromise;
