# src

애플리케이션 소스 코드 루트.

구성 원칙

- app: Next.js 라우팅
- features: 도메인 기능
- shared: 공통 코드

규칙

- 비즈니스 로직은 feature 내부에 둔다.
- 여러 feature가 공유하는 코드만 shared에 둔다.
- app은 라우팅 역할만 담당한다.
