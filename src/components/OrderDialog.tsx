import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { site, type Pkg } from "@/data/site";
import { Check, Loader2 } from "lucide-react";

type PaymentMethod = "bkash" | "nagad" | "rocket" | "upay";

export function OrderDialog({
  pkg,
  onOpenChange,
}: {
  pkg: Pkg | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  // step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [briefFile, setBriefFile] = useState<File | null>(null);

  // step 2
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [txnId, setTxnId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const reset = () => {
    setStep(1);
    setName(""); setPhone(""); setEmail(""); setRequirements(""); setBudget("");
    setBriefFile(null); setTxnId(""); setSenderNumber(""); setScreenshot(null);
    setMethod("bkash");
  };

  const handleClose = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const uploadFile = async (file: File, prefix: string) => {
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("order-uploads").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("order-uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const submit = async () => {
    if (!pkg) return;
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    if (!txnId.trim() || !senderNumber.trim()) {
      toast.error("Please enter transaction ID and sender number.");
      return;
    }
    setSubmitting(true);
    try {
      let brief_file_url: string | null = null;
      let screenshot_url: string | null = null;
      if (briefFile) brief_file_url = await uploadFile(briefFile, "briefs");
      if (screenshot) screenshot_url = await uploadFile(screenshot, "payments");

      const { error } = await supabase.from("orders").insert({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        package_name: pkg.name,
        package_price: pkg.price,
        requirements: requirements.trim() || null,
        budget: budget.trim() || null,
        brief_file_url,
        payment_method: method,
        transaction_id: txnId.trim(),
        sender_number: senderNumber.trim(),
        screenshot_url,
      });
      if (error) throw error;
      setStep(3);
      toast.success("Order received — we'll contact you shortly.");
    } catch (err) {
      console.error(err);
      toast.error("Could not submit order. Please try again or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!pkg} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {pkg && step !== 3 && (
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Order {pkg.name} <span className="text-foreground/50">— ৳{pkg.price.toLocaleString()}</span>
            </DialogTitle>
            <DialogDescription>
              {step === 1 ? "Tell us about your project." : "Submit payment proof to confirm."}
            </DialogDescription>
          </DialogHeader>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="req">Requirements</Label>
              <Textarea id="req" value={requirements} onChange={(e) => setRequirements(e.target.value)} maxLength={1500} rows={3} placeholder="Pages, features, references..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (optional)</Label>
              <Input id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} maxLength={50} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brief">Attach brief / reference (optional)</Label>
              <Input id="brief" type="file" onChange={(e) => setBriefFile(e.target.files?.[0] ?? null)} />
            </div>
            <Button className="w-full rounded-full" onClick={() => setStep(2)} disabled={!name.trim() || !phone.trim()}>
              Continue to payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <Label className="mb-3 block">Payment method</Label>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid grid-cols-2 gap-2">
                {(["bkash", "nagad", "rocket", "upay"] as PaymentMethod[]).map((m) => (
                  <Label
                    key={m}
                    htmlFor={`m-${m}`}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-foreground/15 px-4 py-3 transition-colors hover:bg-beige-soft has-data-[state=checked]:border-foreground"
                  >
                    <RadioGroupItem id={`m-${m}`} value={m} />
                    <span className="capitalize">{m}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="rounded-2xl bg-beige-soft p-4 text-sm">
              <div className="text-foreground/60">Send to ({method.toUpperCase()})</div>
              <div className="mt-1 font-mono text-lg">{site.payments[method]}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="txn">Transaction ID *</Label>
                <Input id="txn" value={txnId} onChange={(e) => setTxnId(e.target.value)} maxLength={50} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sender">Sender number *</Label>
                <Input id="sender" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} maxLength={20} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shot">Screenshot (optional)</Label>
              <Input id="shot" type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 rounded-full" onClick={submit} disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit order
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-foreground text-background">
              <Check size={24} />
            </div>
            <h3 className="font-serif text-2xl">Order received</h3>
            <p className="mt-2 text-sm text-foreground/65">
              We'll review your payment and contact you within a few hours.
            </p>
            <Button className="mt-6 rounded-full" onClick={() => handleClose(false)}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
