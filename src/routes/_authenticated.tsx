import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";

export const Route = createFileRoute("/_authenticated")({
  component: () => (
    <AuthGate requireAdmin>
      <Outlet />
    </AuthGate>
  ),
});
