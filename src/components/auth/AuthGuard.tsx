"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_ROUTES: string[] = ["/login", "/register"];
const DEFAULT_AUTHENTICATED_ROUTE = "/dashboard";

type AuthGuardProps = {
  children: ReactNode;
};

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function FullPageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        color: "#64748b",
      }}
    >
      Loading...
    </div>
  );
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { loading, isAuthenticated } = useAuth();

  const publicRoute = isPublicRoute(pathname);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && !publicRoute) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
      return;
    }

    if (isAuthenticated && publicRoute) {
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
    }
  }, [loading, isAuthenticated, publicRoute, pathname, router]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated && !publicRoute) {
    return <FullPageLoader />;
  }

  if (isAuthenticated && publicRoute) {
    return <FullPageLoader />;
  }

  return children;
}