import { MongoClient } from "mongodb";

/**
 * MongoDB Atlas 연결 문자열.
 */
const mongodbUri = process.env.MONGODB_URI;

/**
 * MongoDB 연결 정보가 없으면
 * 애플리케이션 실행을 중단한다.
 */
if (!mongodbUri) {
  throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
}

/**
 * MongoDB Native Driver 클라이언트.
 *
 * NextAuth MongoDB Adapter에서 사용한다.
 */
const client = new MongoClient(mongodbUri);

/**
 * MongoDB 연결 Promise.
 *
 * NextAuth는 MongoClient 인스턴스가 아니라
 * 연결된 Promise 객체를 전달받아 사용한다.
 *
 * 예:
 * MongoDBAdapter(clientPromise)
 */
const clientPromise = client.connect();

export default clientPromise;
