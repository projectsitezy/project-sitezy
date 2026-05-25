import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";

const searchSchema = z.object({ redirect: z.string().optional().catch("/admin") });

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — Project SITEZY" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    navigate({ to: isAdmin ? "/admin" : "/" });
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/login?redirect=/admin" },
        });
        if (error) throw error;
        toast.success("Admin account created. You can log in now.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const authBusy = loading || loading;

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <div className="rounded-3xl border border-foreground/10 bg-card p-8 shadow-luxe">
          <div className="mb-8 flex justify-center"><Logo /></div>
          <h1 className="font-serif text-2xl text-foreground">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to access your dashboard." : "Sign up to manage your site."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none focus:border-foreground/40"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none focus:border-foreground/40"
              />
            </div>
            <button
              type="submit"
              disabled={authBusy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {authBusy && <Loader2 size={14} className="animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground/80">
            First-time admin? Sign up with <span className="font-medium text-foreground/80">evansheikh69@gmail.com</span> and the same email will get admin access automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
