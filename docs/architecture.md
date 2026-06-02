# Architecture Rules

1. app은 라우팅만 담당한다.

2. 비즈니스 로직은 feature 내부에 둔다.

3. 공통 코드는 shared에 둔다.

4. 기본값은 Server Action이다.

5. Route Handler는 외부 공개 Endpoint가 필요한 경우에만 사용한다.

6. 권장 흐름

action
→ service
→ model

7. 파일명은 kebab-case를 사용한다.
