import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function AuthGate({ requireAdmin = false, children }: { requireAdmin?: boolean; children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: typeof window !== "undefined" ? window.location.pathname : "/" } });
      return;
    }
    if (requireAdmin && !isAdmin) {
      navigate({ to: "/" });
    }
  }, [user, isAdmin, loading, requireAdmin, navigate]);

  if (loading || !user || (requireAdmin && !isAdmin)) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <>{children}</>;
}
