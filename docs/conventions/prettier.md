# Prettier 설정

## 목적

Prettier는 프로젝트 전체의 코드 스타일을 자동으로 통일하는 도구이다.

Syncur에서는 다음을 목표로 사용한다.

- 코드 스타일 통일
- 불필요한 코드 리뷰 감소
- Git Diff 최소화
- Tailwind CSS 클래스 순서 자동 정렬

---

## 설치

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

---

## 설정 파일

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## 설정 설명

### semi

```json
{
  "semi": true
}
```

문장 끝에 세미콜론(`;`)을 자동으로 추가한다.

예시:

```ts
const name = "syncur";
const version = "1.0.0";
```

---

### singleQuote

```json
{
  "singleQuote": false
}
```

문자열에 큰따옴표(`"`)를 사용한다.

예시:

```ts
const title = "Syncur";
```

---

### prettier-plugin-tailwindcss

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Tailwind CSS 클래스를 공식 권장 순서로 자동 정렬한다.

정렬 전:

```tsx
className="border flex p-2 rounded-lg"
```

정렬 후:

```tsx
className="flex rounded-lg border p-2"
```

---

## 사용 방법

전체 파일 포맷팅

```bash
npm run format
```

포맷 확인

```bash
npm run format:check
```

---

## package.json

```json
{
  "scripts": {
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

---

## .prettierignore

```txt
.next
node_modules
coverage
dist
```

Prettier가 포맷하지 않아야 하는 디렉토리를 정의한다.

---

## 프로젝트 규칙

- 코드 스타일 논쟁을 하지 않는다.
- 포맷은 Prettier 결과를 따른다.
- Tailwind 클래스 순서는 직접 정렬하지 않는다.
- 저장 시 자동 포맷을 권장한다.