"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/use-buckets";
import { ApiError } from "@/lib/api-client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isError } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isUnauthorized = isError && (isError as ApiError).status === 401;
    const unauthenticated = !user && !isLoading;

    if (isUnauthorized || unauthenticated) {
      const redirectTo = pathname && pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${redirectTo}`);
    }
  }, [isLoading, isError, user, router, pathname]);

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}
