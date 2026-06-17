"use client"; // 이 파일은 클라이언트 컴포넌트입니다.

import { AdminSidebar } from "./AdminSidebar";
import { useEffect, useState } from "react";

export function AdminSidebarWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  // 컴포넌트가 마운트된 후(클라이언트)에만 렌더링
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // 서버에서는 아무것도 렌더링하지 않음

  return <AdminSidebar />;
}
