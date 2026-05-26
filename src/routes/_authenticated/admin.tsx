import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LayoutDashboard, ShoppingBag, Mail, Package as PackageIcon, Star, Image as ImageIcon,
  HelpCircle, Settings, Megaphone, LogOut, Search, Loader2, Plus, Trash2, ExternalLink, Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

type Tab = "overview" | "orders" | "messages" | "packages" | "reviews" | "portfolio" | "faqs" | "settings" | "popup";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Project SITEZY" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "packages", label: "Packages", icon: PackageIcon },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "portfolio", label: "Portfolio", icon: ImageIcon },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "popup", label: "Popup", icon: Megaphone },
  { id: "settings", label: "Settings", icon: Settings },
];

function AdminDashboard() {
  const { signOut, user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-foreground/10 bg-card p-4 md:block">
          <div className="mb-8 px-2"><Logo /></div>
          <nav className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-accent/40"
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="rounded-xl border border-foreground/10 p-3 text-xs text-muted-foreground">
              <p className="truncate">{user?.email}</p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Link to="/" className="flex-1 grid place-items-center rounded-xl border border-foreground/10 text-xs">
                View site
              </Link>
              <button onClick={signOut} className="grid h-9 w-9 place-items-center rounded-xl border border-foreground/10 hover:bg-destructive/10" aria-label="Sign out">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile top tabs */}
        <div className="md:hidden fixed top-0 inset-x-0 z-30 overflow-x-auto bg-background/90 backdrop-blur border-b border-foreground/10">
          <div className="flex gap-1 p-2">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${tab === t.id ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 pt-16 md:p-8 md:pt-8">
          {tab === "overview" && <OverviewPanel />}
          {tab === "orders" && <OrdersPanel />}
          {tab === "messages" && <MessagesPanel />}
          {tab === "packages" && <PackagesPanel />}
          {tab === "reviews" && <ReviewsPanel />}
          {tab === "portfolio" && <PortfolioPanel />}
          {tab === "faqs" && <FaqsPanel />}
          {tab === "popup" && <PopupPanel />}
          {tab === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

function Header({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ============ OVERVIEW ============ */
function OverviewPanel() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [orders, msgs, pkgs] = await Promise.all([
        supabase.from("orders").select("id, package_price, status, created_at"),
        supabase.from("contact_messages").select("id, is_read"),
        supabase.from("packages").select("id, name").eq("active", true),
      ]);
      const ordersList = orders.data ?? [];
      const total = ordersList.length;
      const pending = ordersList.filter((o) => o.status === "pending").length;
      const revenue = ordersList.filter((o) => o.status === "completed").reduce((s, o) => s + (o.package_price ?? 0), 0);
      const unread = (msgs.data ?? []).filter((m) => !m.is_read).length;
      return { total, pending, revenue, unread, packages: pkgs.data?.length ?? 0 };
    },
  });

  const cards = [
    { label: "Total Orders", value: stats?.total ?? "—" },
    { label: "Pending Orders", value: stats?.pending ?? "—" },
    { label: "Revenue (BDT)", value: stats?.revenue != null ? `৳${stats.revenue.toLocaleString()}` : "—" },
    { label: "Unread Messages", value: stats?.unread ?? "—" },
  ];

  return (
    <div>
      <Header title="Overview" subtitle="At a glance" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-foreground/10 bg-card p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-3 font-serif text-3xl">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ ORDERS ============ */
function OrdersPanel() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (filter !== "all") list = list.filter((o) => o.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) => [o.name, o.phone, o.email, o.package_name].some((v) => v?.toLowerCase().includes(q)));
    }
    return list;
  }, [data, search, filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    qc.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const openFile = async (path: string) => {
    if (path.startsWith("http")) return window.open(path, "_blank");
    const { data, error } = await supabase.storage.from("order-uploads").createSignedUrl(path, 300);
    if (error || !data) return toast.error("Could not open file");
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div>
      <Header title="Orders" subtitle={`${filtered.length} total`} />
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search by name, phone, package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-foreground/15 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-foreground/40"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-foreground/15 bg-background px-3 text-sm">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <Loader2 className="mx-auto mt-12 animate-spin text-muted-foreground" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">When</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Package</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Files</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t border-foreground/5 hover:bg-accent/20">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.name}</p>
                      <p className="text-xs text-muted-foreground">{o.phone}{o.email ? ` · ${o.email}` : ""}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{o.package_name}</p>
                      <p className="text-xs text-muted-foreground">৳{o.package_price?.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {o.payment_method && <p className="capitalize">{o.payment_method}</p>}
                      {o.transaction_id && <p className="text-muted-foreground">TXN: {o.transaction_id}</p>}
                      {o.sender_number && <p className="text-muted-foreground">{o.sender_number}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-col gap-1">
                        {o.brief_file_url && (
                          <button onClick={() => openFile(o.brief_file_url!)} className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground">
                            <Eye size={12} /> Brief
                          </button>
                        )}
                        {o.screenshot_url && (
                          <button onClick={() => openFile(o.screenshot_url!)} className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground">
                            <Eye size={12} /> Screenshot
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="rounded-lg border border-foreground/15 bg-background px-2 py-1 text-xs">
                        <option value="pending">Pending</option>
                        <option value="in-progress">In progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ MESSAGES ============ */
function MessagesPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleRead = async (id: string, is_read: boolean) => {
    await supabase.from("contact_messages").update({ is_read }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
    qc.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  return (
    <div>
      <Header title="Messages" subtitle={`${data?.length ?? 0} total`} />
      {isLoading ? <Loader2 className="mx-auto mt-12 animate-spin text-muted-foreground" /> : (
        <div className="space-y-3">
          {(data ?? []).map((m) => (
            <div key={m.id} className={`rounded-2xl border p-5 ${m.is_read ? "border-foreground/10 bg-card" : "border-foreground/20 bg-accent/20"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{m.name} <span className="font-normal text-muted-foreground">· {m.email}</span></p>
                  <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => toggleRead(m.id, !m.is_read)} className="rounded-full border border-foreground/15 px-3 py-1 text-xs">
                  {m.is_read ? "Mark unread" : "Mark read"}
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">{m.message}</p>
            </div>
          ))}
          {data && data.length === 0 && <div className="rounded-2xl border border-foreground/10 p-12 text-center text-sm text-muted-foreground">No messages yet.</div>}
        </div>
      )}
    </div>
  );
}

/* ============ Generic helpers ============ */
function TextField({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input {...rest} className={`mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 ${rest.className ?? ""}`} />
    </label>
  );
}
function TextArea({ label, ...rest }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <textarea {...rest} className={`mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 ${rest.className ?? ""}`} />
    </label>
  );
}
function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-foreground/30" />
      {label}
    </label>
  );
}

/* ============ PACKAGES ============ */
function PackagesPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "packages"],
    queryFn: async () => {
      const { data } = await supabase.from("packages").select("*").order("sort_order");
      return data ?? [];
    },
  });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "packages"] });
    qc.invalidateQueries({ queryKey: ["packages"] });
  };

  const add = async () => {
    const { error } = await supabase.from("packages").insert({
      slug: `new-${Date.now()}`, name: "New Package", price: 0, features: [], sort_order: (data?.length ?? 0) + 1,
    });
    if (error) return toast.error(error.message);
    refresh();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };
  const save = async (id: string, patch: any) => {
    const { error } = await supabase.from("packages").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    refresh();
  };

  return (
    <div>
      <Header title="Packages" subtitle="Edit pricing cards" action={<button onClick={add} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"><Plus size={14}/> Add</button>} />
      <div className="space-y-4">
        {(data ?? []).map((p) => <PackageRow key={p.id} pkg={p} onSave={save} onRemove={remove} />)}
      </div>
    </div>
  );
}
function PackageRow({ pkg, onSave, onRemove }: { pkg: any; onSave: (id: string, patch: any) => void; onRemove: (id: string) => void }) {
  const [draft, setDraft] = useState<any>(pkg);
  const features = Array.isArray(draft.features) ? draft.features.join("\n") : "";
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <TextField label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        <TextField label="Price (BDT)" type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
        <TextField label="Slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
        <TextField label="Badge (e.g. Most Popular)" value={draft.badge ?? ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} />
        <TextField label="Tagline" value={draft.tagline ?? ""} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />
        <TextField label="Sort order" type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} />
      </div>
      <TextArea label="Features (one per line)" rows={8} className="mt-3" value={features} onChange={(e) => setDraft({ ...draft, features: e.target.value.split("\n").filter(Boolean) })} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-4">
          <CheckField label="Highlighted" checked={draft.highlighted} onChange={(v) => setDraft({ ...draft, highlighted: v })} />
          <CheckField label="Active" checked={draft.active} onChange={(v) => setDraft({ ...draft, active: v })} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => onRemove(pkg.id)} className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive"><Trash2 size={12} className="inline mr-1"/>Delete</button>
          <button onClick={() => onSave(pkg.id, draft)} className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ============ REVIEWS ============ */
function ReviewsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "reviews"], queryFn: async () => (await supabase.from("reviews").select("*").order("sort_order")).data ?? [] });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin", "reviews"] }); qc.invalidateQueries({ queryKey: ["reviews"] }); };
  const add = async () => { const { error } = await supabase.from("reviews").insert({ name: "New Reviewer", body: "Great work!", rating: 5, sort_order: (data?.length ?? 0) + 1 }); if (error) return toast.error(error.message); refresh(); };
  return (
    <div>
      <Header title="Reviews" action={<button onClick={add} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"><Plus size={14}/> Add</button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map((r) => <ReviewRow key={r.id} review={r} refresh={refresh}/>)}
      </div>
    </div>
  );
}
function ReviewRow({ review, refresh }: { review: any; refresh: () => void }) {
  const [d, setD] = useState<any>(review);
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 space-y-3">
      <TextField label="Name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
      <TextField label="Role" value={d.role ?? ""} onChange={(e) => setD({ ...d, role: e.target.value })} />
      <TextField label="Rating (1-5)" type="number" min={1} max={5} value={d.rating} onChange={(e) => setD({ ...d, rating: Number(e.target.value) })} />
      <TextArea label="Review" rows={3} value={d.body} onChange={(e) => setD({ ...d, body: e.target.value })} />
      <TextField label="Sort order" type="number" value={d.sort_order} onChange={(e) => setD({ ...d, sort_order: Number(e.target.value) })} />
      <div className="flex items-center justify-between">
        <CheckField label="Active" checked={d.active} onChange={(v) => setD({ ...d, active: v })} />
        <div className="flex gap-2">
          <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("reviews").delete().eq("id", review.id); refresh(); } }} className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive"><Trash2 size={12}/></button>
          <button onClick={async () => { await supabase.from("reviews").update(d).eq("id", review.id); toast.success("Saved"); refresh(); }} className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ============ PORTFOLIO ============ */
function PortfolioPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "portfolio"], queryFn: async () => (await supabase.from("portfolio_items").select("*").order("sort_order")).data ?? [] });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin", "portfolio"] }); qc.invalidateQueries({ queryKey: ["portfolio_items"] }); };
  const add = async () => { const { error } = await supabase.from("portfolio_items").insert({ title: "New Project", category: "Website", sort_order: (data?.length ?? 0) + 1 }); if (error) return toast.error(error.message); refresh(); };
  return (
    <div>
      <Header title="Portfolio" action={<button onClick={add} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"><Plus size={14}/> Add</button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map((p) => <PortfolioRow key={p.id} item={p} refresh={refresh} />)}
      </div>
    </div>
  );
}
function PortfolioRow({ item, refresh }: { item: any; refresh: () => void }) {
  const [d, setD] = useState<any>(item);
  const [uploading, setUploading] = useState(false);
  const upload = async (f: File) => {
    if (!f.type.startsWith("image/")) return toast.error("Please upload an image file.");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB.");
    setUploading(true);
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
    const path = `portfolio/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, f, {
      cacheControl: "31536000",
      upsert: false,
      contentType: f.type,
    });
    setUploading(false);
    if (error) return toast.error(error.message);
    const { data: u } = supabase.storage.from("site-assets").getPublicUrl(path);
    setD({ ...d, image_url: u.publicUrl });
  };
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 space-y-3">
      {d.image_url && <img src={d.image_url} alt="" className="h-32 w-full rounded-xl object-cover" />}
      <input type="file" accept="image/*" onChange={(e) => e.target.files && upload(e.target.files[0])} className="text-xs" />
      {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
      <TextField label="Title" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} />
      <TextField label="Category" value={d.category ?? ""} onChange={(e) => setD({ ...d, category: e.target.value })} />
      <TextField label="Live URL" value={d.live_url ?? ""} onChange={(e) => setD({ ...d, live_url: e.target.value })} />
      <TextField label="Sort order" type="number" value={d.sort_order} onChange={(e) => setD({ ...d, sort_order: Number(e.target.value) })} />
      <div className="flex items-center justify-between">
        <CheckField label="Active" checked={d.active} onChange={(v) => setD({ ...d, active: v })} />
        <div className="flex gap-2">
          <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("portfolio_items").delete().eq("id", item.id); refresh(); } }} className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive"><Trash2 size={12}/></button>
          <button onClick={async () => { await supabase.from("portfolio_items").update(d).eq("id", item.id); toast.success("Saved"); refresh(); }} className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ============ FAQS ============ */
function FaqsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "faqs"], queryFn: async () => (await supabase.from("faqs").select("*").order("sort_order")).data ?? [] });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin", "faqs"] }); qc.invalidateQueries({ queryKey: ["faqs"] }); };
  const add = async () => { const { error } = await supabase.from("faqs").insert({ question: "New question?", answer: "Answer.", sort_order: (data?.length ?? 0) + 1 }); if (error) return toast.error(error.message); refresh(); };
  return (
    <div>
      <Header title="FAQs" action={<button onClick={add} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"><Plus size={14}/> Add</button>} />
      <div className="space-y-3">
        {(data ?? []).map((f) => <FaqRow key={f.id} faq={f} refresh={refresh} />)}
      </div>
    </div>
  );
}
function FaqRow({ faq, refresh }: { faq: any; refresh: () => void }) {
  const [d, setD] = useState<any>(faq);
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 space-y-3">
      <TextField label="Question" value={d.question} onChange={(e) => setD({ ...d, question: e.target.value })} />
      <TextArea label="Answer" rows={3} value={d.answer} onChange={(e) => setD({ ...d, answer: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Sort order" type="number" value={d.sort_order} onChange={(e) => setD({ ...d, sort_order: Number(e.target.value) })} />
        <div className="flex items-end"><CheckField label="Active" checked={d.active} onChange={(v) => setD({ ...d, active: v })} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("faqs").delete().eq("id", faq.id); refresh(); } }} className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive"><Trash2 size={12}/></button>
        <button onClick={async () => { await supabase.from("faqs").update(d).eq("id", faq.id); toast.success("Saved"); refresh(); }} className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">Save</button>
      </div>
    </div>
  );
}

/* ============ POPUP ============ */
function PopupPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "popup"], queryFn: async () => (await supabase.from("popup_banner").select("*").limit(1).maybeSingle()).data });
  const [d, setD] = useState<any>(null);
  const draft = d ?? data;
  const update = (patch: any) => setD({ ...(draft ?? {}), ...patch });
  const save = async () => {
    if (!draft) return;
    const { error } = await supabase.from("popup_banner").update({
      enabled: draft.enabled, title: draft.title, message: draft.message,
      cta_label: draft.cta_label, cta_url: draft.cta_url, image_url: draft.image_url, frequency: draft.frequency,
    }).eq("id", draft.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["popup_banner"] });
    qc.invalidateQueries({ queryKey: ["admin", "popup"] });
  };
  if (!draft) return <Header title="Popup Banner" />;
  return (
    <div>
      <Header title="Popup Banner" subtitle="Promotional modal shown on homepage" action={
        <button onClick={save} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Save</button>
      } />
      <div className="max-w-2xl space-y-4 rounded-2xl border border-foreground/10 bg-card p-6">
        <CheckField label="Enabled" checked={draft.enabled} onChange={(v) => update({ enabled: v })} />
        <TextField label="Title" value={draft.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
        <TextArea label="Message" rows={3} value={draft.message ?? ""} onChange={(e) => update({ message: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="CTA label" value={draft.cta_label ?? ""} onChange={(e) => update({ cta_label: e.target.value })} />
          <TextField label="CTA URL" value={draft.cta_url ?? ""} onChange={(e) => update({ cta_url: e.target.value })} />
        </div>
        <TextField label="Image URL" value={draft.image_url ?? ""} onChange={(e) => update({ image_url: e.target.value })} />
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Frequency</span>
          <select value={draft.frequency} onChange={(e) => update({ frequency: e.target.value })} className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm">
            <option value="session">Once per session</option>
            <option value="once">Only once (ever)</option>
            <option value="always">Every visit</option>
          </select>
        </label>
      </div>
    </div>
  );
}

/* ============ SETTINGS ============ */
function SettingsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, any> = {};
      (data ?? []).forEach((row) => { map[row.key] = row.value; });
      return map;
    },
  });
  const [draft, setDraft] = useState<Record<string, any> | null>(null);
  const d = draft ?? data ?? {};
  const set = (key: string, value: any) => setDraft({ ...d, [key]: value });

  const saveKey = async (key: string) => {
    const { error } = await supabase.from("site_settings").upsert({ key, value: d[key] });
    if (error) return toast.error(error.message);
    toast.success(`${key} saved`);
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    qc.invalidateQueries({ queryKey: ["public", "settings"] });
  };

  if (!data) return <Header title="Settings" />;
  return (
    <div className="max-w-3xl">
      <Header title="Site Settings" subtitle="Live edit hero text, contact info & payments" />

      <Section title="Hero" onSave={() => saveKey("hero")}>
        <TextField label="Eyebrow" value={d.hero?.eyebrow ?? ""} onChange={(e) => set("hero", { ...d.hero, eyebrow: e.target.value })} />
        <TextField label="Headline (Bangla)" value={d.hero?.headlineBn ?? ""} onChange={(e) => set("hero", { ...d.hero, headlineBn: e.target.value })} />
        <TextField label="Headline (English)" value={d.hero?.headlineEn ?? ""} onChange={(e) => set("hero", { ...d.hero, headlineEn: e.target.value })} />
        <TextArea label="Subheadline" rows={2} value={d.hero?.sub ?? ""} onChange={(e) => set("hero", { ...d.hero, sub: e.target.value })} />
      </Section>

      <Section title="Contact" onSave={() => saveKey("contact")}>
        <TextField label="WhatsApp (local)" value={d.contact?.whatsapp ?? ""} onChange={(e) => set("contact", { ...d.contact, whatsapp: e.target.value })} />
        <TextField label="WhatsApp (intl, e.g. 8801…)" value={d.contact?.whatsappIntl ?? ""} onChange={(e) => set("contact", { ...d.contact, whatsappIntl: e.target.value })} />
        <TextField label="Email" value={d.contact?.email ?? ""} onChange={(e) => set("contact", { ...d.contact, email: e.target.value })} />
      </Section>

      <Section title="Socials" onSave={() => saveKey("socials")}>
        <TextField label="Facebook URL" value={d.socials?.facebook ?? ""} onChange={(e) => set("socials", { ...d.socials, facebook: e.target.value })} />
        <TextField label="Instagram URL" value={d.socials?.instagram ?? ""} onChange={(e) => set("socials", { ...d.socials, instagram: e.target.value })} />
      </Section>

      <Section title="Payments" onSave={() => saveKey("payments")}>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Bkash" value={d.payments?.bkash ?? ""} onChange={(e) => set("payments", { ...d.payments, bkash: e.target.value })} />
          <TextField label="Nagad" value={d.payments?.nagad ?? ""} onChange={(e) => set("payments", { ...d.payments, nagad: e.target.value })} />
          <TextField label="Rocket" value={d.payments?.rocket ?? ""} onChange={(e) => set("payments", { ...d.payments, rocket: e.target.value })} />
          <TextField label="Upay" value={d.payments?.upay ?? ""} onChange={(e) => set("payments", { ...d.payments, upay: e.target.value })} />
        </div>
      </Section>

      <Section title="Live Chat" onSave={() => saveKey("chat")}>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Provider</span>
          <select value={d.chat?.provider ?? "none"} onChange={(e) => set("chat", { ...d.chat, provider: e.target.value })} className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm">
            <option value="none">None</option>
            <option value="tawk">Tawk.to</option>
            <option value="crisp">Crisp</option>
          </select>
        </label>
        <TextField label="Embed / Widget ID" value={d.chat?.embedId ?? ""} onChange={(e) => set("chat", { ...d.chat, embedId: e.target.value })} placeholder="e.g. Tawk: propertyId/widgetId · Crisp: website ID" />
        <p className="text-xs text-muted-foreground">For Tawk.to use format <code>propertyId/widgetId</code>. For Crisp, paste only the website ID.</p>
      </Section>
    </div>
  );
}
function Section({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <div className="mb-6 rounded-2xl border border-foreground/10 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-lg">{title}</h2>
        <button onClick={onSave} className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">Save</button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
