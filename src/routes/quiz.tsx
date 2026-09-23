import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Layers,
  Loader2,
  MoreHorizontal,
  Rocket,
  Sprout,
  TrendingUp,
} from "lucide-react";

import amazonLogo from "@/assets/capec/amazon-logo.png";
import shopifyLogo from "@/assets/capec/shopify-logo.svg";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  QuizFaq,
  QuizFounderTrust,
  QuizOurPartners,
  QuizVideoTestimonials,
  QuizWhyCapec,
  StatBreak,
} from "@/components/capec/quiz-marketing-sections";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Fund Your Next Purchase Order | CapEc Funding Quiz" },
      {
        name: "description",
        content:
          "Answer 7 quick questions and see your CapEc purchase order funding offer, with 25% off your first deal's financing fee.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Fund Your Next Purchase Order | CapEc Funding Quiz" },
      {
        property: "og:description",
        content:
          "See your inventory financing offer in 60 seconds. 25% off the financing fee on your first funded deal.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

const TOTAL_QUESTIONS = 7;

const PLATFORM_OPTIONS = ["Amazon", "Shopify", "Both", "Other"];
const REVENUE_OPTIONS = ["Under $100K", "$100K – $500K", "$500K – $1M", "$1M+"];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Amazon: <img src={amazonLogo} alt="" className="h-full w-auto object-contain" />,
  Shopify: <img src={shopifyLogo} alt="" className="h-full w-auto object-contain" />,
  Both: <Layers className="size-5 text-signal" strokeWidth={2} />,
  Other: <MoreHorizontal className="size-5 text-signal" strokeWidth={2} />,
};

const REVENUE_ICONS: Record<string, React.ReactNode> = {
  "Under $100K": <Sprout className="size-5 text-signal" strokeWidth={2} />,
  "$100K – $500K": <TrendingUp className="size-5 text-signal" strokeWidth={2} />,
  "$500K – $1M": <BarChart3 className="size-5 text-signal" strokeWidth={2} />,
  "$1M+": <Rocket className="size-5 text-signal" strokeWidth={2} />,
};
const HISTORY_OPTIONS = ["Under 6 months", "6 – 12 months", "1 – 3 years", "3+ years"];
const PO_OPTIONS = ["Under $25K", "$25K – $100K", "$100K – $500K", "$500K+"];
const COUNTRY_OPTIONS = ["United States", "Canada", "United Kingdom", "European Union", "Other"];

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
  additionalNotes: string;
};

const EMPTY_ANSWERS: Answers = {
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
  additionalNotes: "",
};

type Screen = "intro" | "question" | "done";

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
  "w-full rounded-lg border border-input bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/30";

function QuizPage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [utm, setUtm] = useState({ utm_source: "", utm_medium: "", utm_campaign: "" });
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    });
  }, []);

  const goTo = (next: number) => {
    setStep(next);
    setAnimKey((k) => k + 1);
  };

  const set = <K extends keyof Answers>(key: K, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pick = (key: keyof Answers, value: string, nextStep: number) => {
    set(key, value);
    goTo(nextStep);
  };

  const back = () => {
    if (step === 1) {
      setAnimKey((k) => k + 1);
      setScreen("intro");
      return;
    }
    goTo(step - 1);
  };

  function validateStep(current: number): boolean {
    if (current === 5) {
      const r = urlSchema.safeParse(answers.storeUrl);
      if (!r.success) {
        setErrors((e) => ({ ...e, storeUrl: r.error.issues[0]?.message ?? "Invalid" }));
        return false;
      }
      return true;
    }
    if (current === 6) {
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

    if (current === 7) {
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
  }

  async function submitLead() {
    if (!validateStep(7)) return;
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
      additional_notes: answers.additionalNotes.trim() || null,
      lead_stage: "quiz-complete",
      source_slug: "capec-quiz",
      offer: "first-deal-discount",
      utm_source: utm.utm_source || null,
      utm_medium: utm.utm_medium || null,
      utm_campaign: utm.utm_campaign || null,
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("idle");
    setAnimKey((k) => k + 1);
    setScreen("done");
  }

  const progress = useMemo(() => (step / TOTAL_QUESTIONS) * 100, [step]);

  if (screen === "intro") {
    return (
      <div className="capec min-h-svh bg-background font-sans text-foreground">
        <div key={animKey} className="capec-quiz-step">
          <IntroHero onStart={() => { setAnimKey((k) => k + 1); setScreen("question"); }} />
          <StatBreak />
          <QuizWhyCapec />
          <QuizVideoTestimonials />
          <QuizOurPartners />
          <QuizFounderTrust />
          <QuizFaq />
          <IntroFinalCta onStart={() => { setAnimKey((k) => k + 1); setScreen("question"); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="capec min-h-svh bg-background font-sans text-foreground">
      <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-5 py-6 sm:px-8 sm:py-10">
        {screen === "question" && (
          <QuizHeader step={step} progress={progress} onBack={back} />
        )}

        <div
          key={animKey}
          className="flex flex-1 flex-col justify-center capec-quiz-step"
        >
          {screen === "question" && step === 1 && (
            <QuestionCards
              title="Where do you sell?"
              options={PLATFORM_OPTIONS}
              value={answers.platform}
              onSelect={(v) => pick("platform", v, 2)}
              icons={PLATFORM_ICONS}
            />
          )}

          {screen === "question" && step === 2 && (
            <QuestionCards
              title="What's your annual revenue?"
              options={REVENUE_OPTIONS}
              value={answers.revenueRange}
              onSelect={(v) => pick("revenueRange", v, 3)}
              icons={REVENUE_ICONS}
            />
          )}

          {screen === "question" && step === 3 && (
            <QuestionCards
              title="How long have you been selling?"
              options={HISTORY_OPTIONS}
              value={answers.sellingHistory}
              onSelect={(v) => pick("sellingHistory", v, 4)}
            />
          )}

          {screen === "question" && step === 4 && (
            <QuestionCards
              title="What's the purchase order or restock amount you're looking to fund?"
              options={PO_OPTIONS}
              value={answers.poAmountRange}
              onSelect={(v) => pick("poAmountRange", v, 5)}
            />
          )}

          {screen === "question" && step === 5 && (
            <StepShell title="What's your online store URL?">
              <Field
                label="Online store URL"
                htmlFor="quiz-store-url"
                error={errors.storeUrl}
                help="For Amazon, please share your Storefront URL."
              >
                <input
                  id="quiz-store-url"
                  className={fieldClass}
                  inputMode="url"
                  placeholder="https://yourbrand.com"
                  value={answers.storeUrl}
                  onChange={(e) => set("storeUrl", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && validateStep(5)) goTo(6);
                  }}
                  aria-invalid={Boolean(errors.storeUrl)}
                />
              </Field>
              <NextButton onClick={() => { if (validateStep(5)) goTo(6); }} />
            </StepShell>
          )}

          {screen === "question" && step === 6 && (
            <StepShell title="Your legal business name">
              <div className="space-y-4">
                <Field label="Legal business name" htmlFor="quiz-business" error={errors.businessName}>
                  <input
                    id="quiz-business"
                    className={fieldClass}
                    placeholder="Northline Supply Co. LLC"
                    value={answers.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                    aria-invalid={Boolean(errors.businessName)}
                  />
                </Field>
                <Field
                  label="Where is your business based?"
                  htmlFor="quiz-country"
                  error={errors.businessCountry}
                >
                  <select
                    id="quiz-country"
                    className={fieldClass}
                    value={answers.businessCountry}
                    onChange={(e) => set("businessCountry", e.target.value)}
                    aria-invalid={Boolean(errors.businessCountry)}
                  >
                    <option value="" disabled>
                      Select a country
                    </option>
                    {COUNTRY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <NextButton onClick={() => { if (validateStep(6)) goTo(7); }} />
            </StepShell>
          )}

          {screen === "question" && step === 7 && (
            <StepShell title="Almost done — where should we send your offer?">
              <div className="space-y-4">
                <Field label="Full name" htmlFor="quiz-name" error={errors.fullName}>
                  <input
                    id="quiz-name"
                    className={fieldClass}
                    placeholder="Alex Carter"
                    value={answers.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                </Field>
                <Field label="Work email" htmlFor="quiz-email" error={errors.email}>
                  <input
                    id="quiz-email"
                    type="email"
                    inputMode="email"
                    className={fieldClass}
                    placeholder="you@yourbrand.com"
                    value={answers.email}
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>
                <Field label="Phone" htmlFor="quiz-phone" error={errors.phone}>
                  <input
                    id="quiz-phone"
                    type="tel"
                    inputMode="tel"
                    className={fieldClass}
                    placeholder="+1 555 000 1234"
                    value={answers.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                  />
                </Field>
                <Field
                  label="Anything else we should know? (optional)"
                  help="E.g. a supplier deadline, a specific PO you're trying to fund, or timing that matters."
                  htmlFor="quiz-notes"
                >
                  <textarea
                    id="quiz-notes"
                    rows={3}
                    className={`${fieldClass} resize-none`}
                    placeholder="Optional — anything that would help our team prepare your offer"
                    value={answers.additionalNotes}
                    onChange={(e) => set("additionalNotes", e.target.value)}
                  />
                </Field>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Our team will review your details and reach out with your funding offer, no
                obligation.
              </p>
              <Button
                type="button"
                onClick={submitLead}
                disabled={status === "submitting"}
                className="mt-4 h-14 w-full text-base font-bold"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Get My Funding Offer
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
              {status === "error" && <ErrorNote />}
            </StepShell>
          )}

          {screen === "done" && (
            <Confirmation
              title={`Thanks, ${answers.fullName.trim().split(" ")[0] || "there"} — we've got your details.`}
              body="A member of our team will review your eligibility and be in touch within one business day with your offer."
              nextSteps={[
                "Our team reviews your details and confirms eligibility — usually within one business day.",
                "We call or email you with your funding offer, including your first-deal fee.",
                "If you accept, we move to funding your purchase order — no obligation to accept.",
              ]}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function QuizHeader({
  step,
  progress,
  onBack,
}: {
  step: number;
  progress: number;
  onBack: () => void;
}) {
  return (
    <header className="shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold tracking-[0.2em] text-headline-emphasis">
          CAPEC
        </span>
        {step > 1 ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-signal"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        ) : (
          <span className="w-12" />
        )}
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-center text-xs font-medium tracking-wide text-muted-foreground">
        Question {step} of {TOTAL_QUESTIONS}
      </p>
    </header>
  );
}

function IntroHero({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 text-center sm:px-8 sm:py-14">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
        No Equity &nbsp;·&nbsp; No Personal Guarantee &nbsp;·&nbsp; 24-Hour Approval
      </p>

      <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-headline-emphasis sm:text-5xl">
        Fund Your Next <span className="text-signal">Purchase Order</span>
      </h1>
      <p className="mt-3 text-lg font-semibold text-headline-secondary sm:text-xl">
        With Fast, Flexible Inventory Financing
      </p>
      <p className="mt-2 text-base font-bold text-foreground">
        See Your Offer in <span className="text-signal">60 Seconds</span>
      </p>

      <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <BadgeCheck className="size-4 text-signal" strokeWidth={2.2} />
        1,000+ POs Funded
      </p>

      <div className="mt-6 rounded-2xl bg-signal px-6 py-6 text-white shadow-capec">
        <p className="text-2xl font-extrabold leading-tight sm:text-3xl">
          25% OFF Your First Deal's Financing Fee
        </p>
        <p className="mt-2 text-sm font-medium text-white/85">
          On a $100K PO, that's $2,500 back in your business.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface-subtle px-5 py-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Standard fee
          </p>
          <p className="mt-1 text-2xl font-extrabold text-foreground line-through decoration-muted-foreground/50">
            $10,000
          </p>
        </div>
        <div className="rounded-xl border-2 border-signal bg-signal-dim px-5 py-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-signal">
            Your first-deal fee
          </p>
          <p className="mt-1 text-2xl font-extrabold text-headline-emphasis">$7,500</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Based on a $100,000 purchase order.</p>

      <div className="mt-6 rounded-xl border border-hairline bg-surface-subtle px-5 py-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Who we fund
        </p>
        <ul className="mt-3 space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={2.2} />
            6+ months of sales history
          </li>
          <li className="flex items-start gap-2">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={2.2} />
            $100K+ in annual revenue
          </li>
          <li className="flex items-start gap-2">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={2.2} />
            Existing ASINs/SKUs — private label preferred
          </li>
          <li className="flex items-start gap-2">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={2.2} />
            Based in the US, Canada, UK, or EU
          </li>
        </ul>
      </div>

      <Button
        type="button"
        onClick={onStart}
        className="group mt-7 h-14 w-full text-base font-bold sm:w-auto sm:px-10"
      >
        Start My Application
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}

function IntroFinalCta({ onStart }: { onStart: () => void }) {
  return (
    <section className="border-t border-border bg-headline-emphasis text-primary-foreground">
      <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/70">
          25% off your first funded deal's fee
        </p>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
          Fund Your Purchase Order Today
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80">
          Approval in 24 hours. Fund up to 2.5x your monthly sales.
        </p>
        <Button
          type="button"
          onClick={onStart}
          variant="secondary"
          className="group mt-7 h-14 w-full text-base font-bold sm:w-auto sm:px-10"
        >
          Start My Application
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <p className="mt-4 text-xs text-primary-foreground/70">Financing is subject to approval.</p>
      </div>
    </section>
  );
}

function StepShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-extrabold leading-tight text-headline-emphasis sm:text-4xl">
        {title}
      </h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function QuestionCards({
  title,
  options,
  value,
  onSelect,
  icons,
}: {
  title: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  icons?: Record<string, React.ReactNode>;
}) {
  return (
    <StepShell title={title}>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option;
          const icon = icons?.[option];
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              aria-pressed={selected}
              className={`flex items-center gap-3 rounded-xl border px-5 py-5 text-left text-base font-semibold transition-all hover:border-signal hover:bg-signal-dim ${
                selected
                  ? "border-signal bg-signal-dim text-headline-emphasis"
                  : "border-hairline bg-card text-foreground"
              }`}
            >
              {icon && <span className="flex size-6 shrink-0 items-center justify-center">{icon}</span>}
              {option}
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick} className="mt-5 h-14 w-full text-base font-bold sm:w-auto sm:px-10">
      Continue
      <ArrowRight className="size-4" />
    </Button>
  );
}

function ErrorNote() {
  return (
    <p role="alert" className="mt-3 text-sm text-destructive">
      We couldn't submit that just now. Please press the button again. If it keeps failing, email us
      at funding@capec.io.
    </p>
  );
}

function Confirmation({
  title,
  body,
  nextSteps,
}: {
  title: string;
  body: string;
  nextSteps?: string[];
}) {
  return (
    <div className="py-10 text-center">
      <CheckCircle2 className="mx-auto size-12 text-signal" strokeWidth={1.5} />
      <h1 className="mt-5 text-3xl font-extrabold leading-tight text-headline-emphasis sm:text-4xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
        {body}
      </p>
      {nextSteps && nextSteps.length > 0 && (
        <div className="mx-auto mt-7 max-w-md rounded-xl border border-hairline bg-surface-subtle px-5 py-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What happens next
          </p>
          <ol className="mt-3 space-y-3">
            {nextSteps.map((stepText, i) => (
              <li key={stepText} className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-signal text-[0.65rem] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-foreground">{stepText}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  help,
  htmlFor,
  error,
  children,
}: {
  label: string;
  help?: string | undefined;
  htmlFor: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {help && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/80">{help}</p>}
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
