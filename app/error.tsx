"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 Sentry 등으로 전송)
    console.error("애플리케이션 에러:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl mb-4">😵</h1>
          <h2 className="text-2xl font-bold mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 dark:text-gray-400">
            일시적인 문제가 발생했습니다. 다시 시도해 주세요.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <summary className="cursor-pointer font-semibold text-red-900 dark:text-red-300">
              에러 상세 정보
            </summary>
            <pre className="mt-2 text-xs overflow-auto text-red-800 dark:text-red-400">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>다시 시도</Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="secondary"
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
