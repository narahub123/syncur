export default function ThemeTestPage() {
  return (
    <main className="bg-background text-foreground min-h-screen p-8">
      <div className="mx-auto max-w-md space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Theme Test</h1>
          <p className="text-muted-foreground">
            테마 토큰이 정상적으로 적용되는지 확인합니다.
          </p>
        </header>

        <section className="bg-card border-border rounded-lg border p-4">
          <h2 className="text-card-foreground font-semibold">Card 테스트</h2>

          <p className="text-muted-foreground mt-2 text-sm">
            card / card-foreground / border / muted-foreground 확인
          </p>
        </section>

        <section className="space-y-3">
          <button
            type="button"
            className="bg-primary text-primary-foreground rounded-md px-4 py-2"
          >
            Primary Button
          </button>

          <input
            type="text"
            placeholder="포커스 스타일 확인"
            className="bg-background border-border w-full rounded-md border px-3 py-2"
          />
        </section>
      </div>
    </main>
  );
}
