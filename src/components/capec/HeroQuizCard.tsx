// Compact, card-scoped multi-step version of the /quiz funnel, embedded in
// the /capec hero (matching the step-counter + progress-bar + Back/Next
// structure of growbi.co/medspa's embedded quiz widget). Question set and
// copy are duplicated from src/routes/quiz.tsx, not imported, since that's
// a separate route with its own full-page flow — keeping this
// self-contained avoids coupling the two.
import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Layers,
  Loader2,
  MoreHorizontal,
  Rocket,
  Sprout,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import amazonLogo from "@/assets/capec/amazon-logo.png";
import shopifyLogo from "@/assets/capec/shopify-logo.svg";

const PLATFORM_OPTIONS = ["Amazon", "Shopify", "Both", "Other"];
const REVENUE_OPTIONS = ["Under $100K", "$100K – $500K", "$500K – $1M", "$1M+"];
const HISTORY_OPTIONS = ["Under 6 months", "6 – 12 months", "1 – 3 years", "3+ years"];
const PO_OPTIONS = ["Under $25K", "$25K – $100K", "$100K – $500K", "$500K+"];
const COUNTRY_OPTIONS = ["United States", "Canada", "United Kingdom", "European Union", "Other"];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Amazon: <img src={amazonLogo} alt="" className="h-full w-auto object-contain" />,
  Shopify: <img src={shopifyLogo} alt="" className="h-full w-auto object-contain" />,
  Both: <Layers className="size-4 text-signal" strokeWidth={2} />,
  Other: <MoreHorizontal className="size-4 text-signal" strokeWidth={2} />,
};

const REVENUE_ICON_LIST: LucideIcon[] = [Sprout, TrendingUp, BarChart3, Rocket];

type Answers = {
  platform: string;
  revenueRange: string;
  sellingHistory: string;
  poAmountRange: string;
  storeUrl: string;
  businessName: string;
  businessCountry: string;
  fullName: string;
  email: string;
  phone: string;
};

const EMPTY: Answers = {
  platform: "",
  revenueRange: "",
  sellingHistory: "",
  poAmountRange: "",
  storeUrl: "",
  businessName: "",
  businessCountry: "",
  fullName: "",
  email: "",
  phone: "",
};

const urlSchema = z
  .string()
  .trim()
  .min(4, { message: "Enter your online store URL" })
  .max(300, { message: "Keep this under 300 characters" })
  .regex(/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i, { message: "That URL doesn't look right" });

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Enter your work email" })
  .email({ message: "That email doesn't look right" })
  .max(255, { message: "Keep this under 255 characters" });

const phoneSchema = z
  .string()
  .trim()
  .min(7, { message: "Enter your phone number" })
  .max(30, { message: "Keep this under 30 characters" })
  .regex(/^[+()\-\s\d.]+$/, { message: "Use digits, spaces, and + ( ) - only" });

const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "This field is required" })
  .max(120, { message: "Keep this under 120 characters" });

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/30";

const TOTAL_STEPS = 7;

export function HeroQuizCard() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "done">("idle");

  const set = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    if (step === 1) return Boolean(answers.platform);
    if (step === 2) return Boolean(answers.revenueRange);
    if (step === 3) return Boolean(answers.sellingHistory);
    if (step === 4) return Boolean(answers.poAmountRange);
    if (step === 5) {
      const r = urlSchema.safeParse(answers.storeUrl);
      if (!r.success) {
        setErrors((e) => ({ ...e, storeUrl: r.error.issues[0]?.message ?? "Invalid" }));
        return false;
      }
      return true;
    }
    if (step === 6) {
      const next: Partial<Record<keyof Answers, string>> = {};
      const n = nameSchema.safeParse(answers.businessName);
      if (!n.success) next.businessName = n.error.issues[0]?.message ?? "Invalid";
      if (!answers.businessCountry) next.businessCountry = "Select where your business is based";
      if (Object.keys(next).length > 0) {
        setErrors((e) => ({ ...e, ...next }));
        return false;
      }
      return true;
    }
    if (step === 7) {
      const next: Partial<Record<keyof Answers, string>> = {};
      const n = nameSchema.safeParse(answers.fullName);
      if (!n.success) next.fullName = n.error.issues[0]?.message ?? "Invalid";
      const em = emailSchema.safeParse(answers.email);
      if (!em.success) next.email = em.error.issues[0]?.message ?? "Invalid";
      const ph = phoneSchema.safeParse(answers.phone);
      if (!ph.success) next.phone = ph.error.issues[0]?.message ?? "Invalid";
      if (Object.keys(next).length > 0) {
        setErrors((e) => ({ ...e, ...next }));
        return false;
      }
      return true;
    }
    return true;
  };

  const canAdvance =
    (step === 1 && Boolean(answers.platform)) ||
    (step === 2 && Boolean(answers.revenueRange)) ||
    (step === 3 && Boolean(answers.sellingHistory)) ||
    (step === 4 && Boolean(answers.poAmountRange)) ||
    step >= 5;

  const next = async () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }
    setStatus("submitting");
    const { error } = await supabase.from("leads").insert({
      brand_name: answers.businessName.trim(),
      business_country: answers.businessCountry,
      full_name: answers.fullName.trim(),
      online_store_url: answers.storeUrl.trim(),
      revenue_range: answers.revenueRange,
      platform: answers.platform,
      selling_history: answers.sellingHistory,
      po_amount_range: answers.poAmountRange,
      email: answers.email.trim(),
      phone: answers.phone.trim(),
      lead_stage: "quiz-complete",
      source_slug: "capec",
      offer: "first-deal-discount",
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  if (status === "done") {
    return (
      <div className="rounded-md border border-border bg-card p-6 text-center shadow-capec sm:p-8">
        <CheckCircle2 className="mx-auto size-10 text-signal" strokeWidth={1.5} />
        <p className="mt-4 text-lg font-bold text-headline-emphasis">
          Thanks, {answers.fullName.trim().split(" ")[0] || "there"} — we've got your details.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          A member of our team will review your eligibility and be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card p-5 shadow-capec sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-wide text-headline-emphasis">
          Get your funding offer
        </p>
        <p className="text-xs font-semibold text-muted-foreground">{step} / {TOTAL_STEPS}</p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-signal transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="mt-5 min-h-[220px]">
        {step === 1 && (
          <OptionStep
            title="What kind of business are you running for?"
            help="Choose one."
            options={PLATFORM_OPTIONS}
            value={answers.platform}
            onSelect={(v) => set("platform", v)}
            icons={PLATFORM_ICONS}
          />
        )}
        {step === 2 && (
          <OptionStep
            title="What's your annual revenue?"
            help="Choose one."
            options={REVENUE_OPTIONS}
            value={answers.revenueRange}
            onSelect={(v) => set("revenueRange", v)}
            icons={Object.fromEntries(
              REVENUE_OPTIONS.map((opt, i) => {
                const Icon = REVENUE_ICON_LIST[i] ?? Sprout;
                return [opt, <Icon key={opt} className="size-4 text-signal" strokeWidth={2} />];
              }),
            )}
          />
        )}
        {step === 3 && (
          <OptionStep
            title="How long have you been selling?"
            help="Choose one."
            options={HISTORY_OPTIONS}
            value={answers.sellingHistory}
            onSelect={(v) => set("sellingHistory", v)}
          />
        )}
        {step === 4 && (
          <OptionStep
            title="What PO or restock amount are you looking to fund?"
            help="Choose one."
            options={PO_OPTIONS}
            value={answers.poAmountRange}
            onSelect={(v) => set("poAmountRange", v)}
          />
        )}
        {step === 5 && (
          <div>
            <p className="text-base font-bold text-headline-emphasis">What's your online store URL?</p>
            <div className="mt-4">
              <input
                className={fieldClass}
                placeholder="https://yourbrand.com"
                value={answers.storeUrl}
                onChange={(e) => set("storeUrl", e.target.value)}
                aria-invalid={Boolean(errors.storeUrl)}
              />
              {errors.storeUrl && <p className="mt-1.5 text-xs text-destructive">{errors.storeUrl}</p>}
              <p className="mt-1.5 text-xs text-muted-foreground">For Amazon, please share your Storefront URL.</p>
            </div>
          </div>
        )}
        {step === 6 && (
          <div>
            <p className="text-base font-bold text-headline-emphasis">Your legal business name</p>
            <div className="mt-4 space-y-3">
              <div>
                <input
                  className={fieldClass}
                  placeholder="Northline Supply Co. LLC"
                  value={answers.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                  aria-invalid={Boolean(errors.businessName)}
                />
                {errors.businessName && <p className="mt-1.5 text-xs text-destructive">{errors.businessName}</p>}
              </div>
              <div>
                <select
                  className={fieldClass}
                  value={answers.businessCountry}
                  onChange={(e) => set("businessCountry", e.target.value)}
                  aria-invalid={Boolean(errors.businessCountry)}
                >
                  <option value="" disabled>
                    Where is your business based?
                  </option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.businessCountry && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.businessCountry}</p>
                )}
              </div>
            </div>
          </div>
        )}
        {step === 7 && (
          <div>
            <p className="text-base font-bold text-headline-emphasis">Almost done — where should we send your offer?</p>
            <div className="mt-4 space-y-3">
              <div>
                <input
                  className={fieldClass}
                  placeholder="Alex Carter"
                  value={answers.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                />
                {errors.fullName && <p className="mt-1.5 text-xs text-destructive">{errors.fullName}</p>}
              </div>
              <div>
                <input
                  type="email"
                  className={fieldClass}
                  placeholder="you@yourbrand.com"
                  value={answers.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  className={fieldClass}
                  placeholder="+1 555 000 1234"
                  value={answers.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
              </div>
              {status === "error" && (
                <p className="text-xs text-destructive">Something went wrong — please try again.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          disabled={step === 1}
          className="gap-1.5 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={next}
          disabled={!canAdvance || status === "submitting"}
          className="gap-1.5 text-sm font-bold"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending…
            </>
          ) : step === TOTAL_STEPS ? (
            <>Get My Funding Offer <ArrowRight className="size-4" /></>
          ) : (
            <>Next <ArrowRight className="size-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}

function OptionStep({
  title,
  help,
  options,
  value,
  onSelect,
  icons,
}: {
  title: string;
  help?: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  icons?: Record<string, React.ReactNode>;
}) {
  return (
    <div>
      <p className="text-base font-bold text-headline-emphasis">{title}</p>
      {help && <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{help}</p>}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option;
          const icon = icons?.[option];
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              aria-pressed={selected}
              className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                selected
                  ? "border-signal bg-signal-dim text-headline-emphasis"
                  : "border-hairline bg-card text-foreground hover:border-signal/50"
              }`}
            >
              <span
                className={`grid size-4 shrink-0 place-items-center rounded-full border-2 ${
                  selected ? "border-signal bg-signal" : "border-hairline"
                }`}
              >
                {selected && <span className="size-1.5 rounded-full bg-white" />}
              </span>
              {icon && <span className="flex size-5 shrink-0 items-center justify-center">{icon}</span>}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
