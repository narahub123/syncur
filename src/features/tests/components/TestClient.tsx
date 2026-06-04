"use client";

import Button from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { useState } from "react";

const TestClient = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

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
        <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
        <Modal.Root open={isOpen} onClose={onClose}>
          <Modal.Content>
            <Modal.Close>닫기</Modal.Close>
            <Modal.Header>
              <Modal.Title>제목</Modal.Title>
              <Modal.Description>설명</Modal.Description>
            </Modal.Header>
            <Modal.Main>메인</Modal.Main>
            <Modal.Footer>푸터</Modal.Footer>
          </Modal.Content>
        </Modal.Root>

        <section className="space-y-3">
          <Button disabled={false} variant="danger">
            Primary Button
          </Button>

          <input
            type="text"
            placeholder="포커스 스타일 확인"
            className="bg-background border-border w-full rounded-md border px-3 py-2"
          />
        </section>
      </div>
    </main>
  );
};

export default TestClient;
