import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import capecLogo from "@/assets/capec/capec-logo.png.asset.json";

const LOGO_SRC = capecLogo.url;

// Step 1-4: low-commitment single-select questions (auto-advance on click).
const PLATFORM_OPTIONS = ["Amazon", "Shopify", "Both", "Other"];
const REVENUE_OPTIONS = ["Under $100K", "$100K – $500K", "$500K – $1M", "$1M+"];
const HISTORY_OPTIONS = ["Under 6 months", "6 – 12 months", "1 – 3 years", "3+ years"];
const PO_OPTIONS = ["Under $25K", "$25K – $100K", "$100K – $500K", "$500K+"];

const DISQUALIFY_REVENUE = "Under $100K";
const DISQUALIFY_HISTORY = "Under 6 months";

const TOTAL_STEPS = 7;

const urlSchema = z
  .string()
  .trim()
  .min(3, { message: "Enter your online store URL" })
  .max(300, { message: "Keep this under 300 characters" })
  .regex(/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i, { message: "That URL doesn't look right" });

const businessSchema = z
  .string()
  .trim()
  .min(2, { message: "Enter your legal business name" })
  .max(160, { message: "Keep this under 160 characters" });

const contactSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Enter your full name" }).max(120),
  email: z
    .string()
    .trim()
    .min(1, { message: "Enter your work email" })
    .email({ message: "That email doesn't look right" })
    .max(255),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Enter your phone number" })
    .max(30)
    .regex(/^[+()\d\s-]+$/, { message: "That phone number doesn't look right" }),
});

const emailOnlySchema = z
  .string()
  .trim()
  .min(1, { message: "Enter your email" })
  .email({ message: "That email doesn't look right" })
  .max(255);

type Answers = {
  platform: string;
  revenueRange: string;
  sellingHistory: string;
  poAmount: string;
  storeUrl: string;
  businessName: string;
  fullName: string;
  email: string;
  phone: string;
};

const EMPTY: Answers = {
  platform: "",
  revenueRange: "",
  sellingHistory: "",
  poAmount: "",
  storeUrl: "",
  businessName: "",
  fullName: "",
  email: "",
  phone: "",
};

type QuizErrors = Partial<Record<keyof Answers, string | undefined>>;

type Screen = number | "disqualified" | "done";

type QuizSearch = {
  utm_source?: string | undefined;
  utm_medium?: string | undefined;
  utm_campaign?: string | undefined;
};

const str = (value: unknown) => (typeof value === "string" && value ? value : undefined);

export const Route = createFileRoute("/quiz")({
  validateSearch: (search: Record<string, unknown>): QuizSearch => ({
    utm_source: str(search["utm_source"]),
    utm_medium: str(search["utm_medium"]),
    utm_campaign: str(search["utm_campaign"]),
  }),
  head: () => ({
    meta: [
      { title: "Get Your CapEc Funding Offer | 2 Minute Application" },
      {
        name: "description",
        content:
          "Answer a few quick questions about your ecommerce store and get a purchase order funding offer, with 25% off your first funded deal's fee.",
      },
      { property: "og:title", content: "Get Your CapEc Funding Offer" },
      {
        property: "og:description",
        content: "A few quick questions and our team reaches out within one business day with your offer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: QuizPage,
});

const fieldClass =
  "w-full rounded-md bg-background border border-input px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal";

function QuizPage() {
  const [screen, setScreen] = useState<Screen>(1);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [errors, setErrors] = useState<QuizErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [utm, setUtm] = useState({ utm_source: "", utm_medium: "", utm_campaign: "" });
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistError, setWaitlistError] = useState<string | undefined>(undefined);
  const [waitlistDone, setWaitlistDone] = useState(false);

  // Hidden campaign fields, captured from the URL on load (same pattern as /capec).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    });
  }, []);

  const stepNumber = typeof screen === "number" ? screen : TOTAL_STEPS;
  const progress = useMemo(() => {
    if (screen === "done") return 100;
    return Math.round(((stepNumber - 1) / TOTAL_STEPS) * 100);
  }, [screen, stepNumber]);

  const set = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pick = (key: keyof Answers, value: string, next: Screen) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setScreen(next);
  };

  const back = () => {
    if (screen === "disqualified") {
      setScreen(answers.revenueRange === DISQUALIFY_REVENUE ? 2 : 3);
      return;
    }
    if (typeof screen === "number" && screen > 1) setScreen(screen - 1);
  };

  function validateAndAdvance(step: 5 | 6 | 7) {
    if (step === 5) {
      const parsed = urlSchema.safeParse(answers.storeUrl);
      if (!parsed.success) {
        setErrors((e) => ({ ...e, storeUrl: parsed.error.issues[0]?.message }));
        return;
      }
      setScreen(6);
      return;
    }
    if (step === 6) {
      const parsed = businessSchema.safeParse(answers.businessName);
      if (!parsed.success) {
        setErrors((e) => ({ ...e, businessName: parsed.error.issues[0]?.message }));
        return;
      }
      setScreen(7);
      return;
    }
    void submit();
  }

  async function submit() {
    const parsed = contactSchema.safeParse({
      fullName: answers.fullName,
      email: answers.email,
      phone: answers.phone,
    });
    if (!parsed.success) {
      const next: QuizErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Answers;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors((e) => ({ ...e, ...next }));
      return;
    }

    setStatus("submitting");
    const { error } = await supabase.from("leads").insert({
      brand_name: answers.businessName,
      full_name: parsed.data.fullName,
      online_store_url: answers.storeUrl,
      revenue_range: answers.revenueRange,
      selling_history: answers.sellingHistory,
      po_amount_range: answers.poAmount,
      platform: answers.platform,
      email: parsed.data.email,
      phone: parsed.data.phone,
      lead_stage: "qualified",
      source_slug: "capec",
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
    setScreen("done");
  }

  async function submitWaitlist() {
    const parsed = emailOnlySchema.safeParse(waitlistEmail);
    if (!parsed.success) {
      setWaitlistError(parsed.error.issues[0]?.message);
      return;
    }
    setWaitlistError(undefined);
    setStatus("submitting");
    const { error } = await supabase.from("leads").insert({
      brand_name: answers.businessName || "Not provided",
      email: parsed.data,
      platform: answers.platform || null,
      revenue_range: answers.revenueRange || null,
      selling_history: answers.sellingHistory || null,
      lead_stage: "not-yet-eligible",
      source_slug: "capec",
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
    setWaitlistDone(true);
  }

  return (
    <div className="capec flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-header-border bg-header">
        <div className="mx-auto flex min-h-16 max-w-3xl items-center px-5 py-2 sm:px-6">
          <Link to="/capec" className="inline-flex items-center" aria-label="Back to CapEc">
            <img src={LOGO_SRC} alt="CapEc" className="h-8 w-auto" />
          </Link>
        </div>
        {screen !== "done" && screen !== "disqualified" && (
          <div className="mx-auto max-w-3xl px-5 pb-3 sm:px-6">
            <div className="flex items-center justify-between text-xs font-semibold text-header-muted">
              <span>
                Step {stepNumber} of {TOTAL_STEPS}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-header-border">
              <div
                className="h-full rounded-full bg-signal transition-[width] duration-300 ease-out"
                style={{ width: `${Math.max(progress, 4)}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-6 sm:py-12">
        <div key={String(screen)} className="quiz-step w-full max-w-2xl">
          {screen !== 1 && screen !== "done" && (
            <button
              type="button"
              onClick={back}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-signal"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
          )}

          {screen === 1 && (
            <CardStep
              title="Where do you sell?"
              options={PLATFORM_OPTIONS}
              selected={answers.platform}
              onPick={(v) => pick("platform", v, 2)}
            />
          )}

          {screen === 2 && (
            <CardStep
              title="What's your annual revenue?"
              options={REVENUE_OPTIONS}
              selected={answers.revenueRange}
              onPick={(v) => pick("revenueRange", v, v === DISQUALIFY_REVENUE ? "disqualified" : 3)}
            />
          )}

          {screen === 3 && (
            <CardStep
              title="How long have you been selling?"
              options={HISTORY_OPTIONS}
              selected={answers.sellingHistory}
              onPick={(v) => pick("sellingHistory", v, v === DISQUALIFY_HISTORY ? "disqualified" : 4)}
            />
          )}

          {screen === 4 && (
            <CardStep
              title="What's the purchase order or restock amount you're looking to fund?"
              options={PO_OPTIONS}
              selected={answers.poAmount}
              onPick={(v) => pick("poAmount", v, 5)}
            />
          )}

          {screen === 5 && (
            <div>
              <StepTitle>What's your online store URL?</StepTitle>
              <input
                className={`mt-6 ${fieldClass}`}
                inputMode="url"
                placeholder="https://yourbrand.com"
                value={answers.storeUrl}
                onChange={(e) => set("storeUrl", e.target.value)}
                aria-invalid={Boolean(errors.storeUrl)}
              />
              <p className="mt-2 text-sm text-muted-foreground">For Amazon, please share your Storefront URL.</p>
              {errors.storeUrl && <ErrorText>{errors.storeUrl}</ErrorText>}
              <NextButton onClick={() => validateAndAdvance(5)} />
            </div>
          )}

          {screen === 6 && (
            <div>
              <StepTitle>Your legal business name</StepTitle>
              <input
                className={`mt-6 ${fieldClass}`}
                placeholder="Northline Supply Co. LLC"
                value={answers.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                aria-invalid={Boolean(errors.businessName)}
              />
              {errors.businessName && <ErrorText>{errors.businessName}</ErrorText>}
              <NextButton onClick={() => validateAndAdvance(6)} />
            </div>
          )}

          {screen === 7 && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                validateAndAdvance(7);
              }}
            >
              <StepTitle>Almost done. Where should we send your offer?</StepTitle>
              <div className="mt-6 space-y-4">
                <div>
                  <input
                    className={fieldClass}
                    placeholder="Full name"
                    autoComplete="name"
                    value={answers.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
                </div>
                <div>
                  <input
                    className={fieldClass}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Work email"
                    value={answers.email}
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </div>
                <div>
                  <input
                    className={fieldClass}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Phone"
                    value={answers.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Our team will review your details and reach out with your funding offer, no obligation.
              </p>
              <Button type="submit" disabled={status === "submitting"} className="mt-6 h-13 w-full py-4 text-base font-bold">
                {status === "submitting" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Get My Funding Offer <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
              {status === "error" && (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  We couldn't submit that just now. Please press the button again. If it keeps failing, email us
                  at funding@capec.io.
                </p>
              )}
            </form>
          )}

          {screen === "disqualified" && (
            <div className="rounded-md border border-border bg-card p-6 sm:p-8">
              {waitlistDone ? (
                <>
                  <CheckCircle2 className="size-8 text-signal" strokeWidth={1.5} />
                  <p className="mt-4 text-2xl font-extrabold text-headline-emphasis">Thanks, you're on our list.</p>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    We'll reach out as soon as you're eligible for funding.
                  </p>
                </>
              ) : (
                <>
                  <StepTitle>Thanks for your interest</StepTitle>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Right now we typically fund sellers with 6+ months of sales history and $100K+ in annual
                    revenue. Leave your email and we'll reach out as soon as you're eligible.
                  </p>
                  <div className="mt-6">
                    <input
                      className={fieldClass}
                      type="email"
                      inputMode="email"
                      placeholder="you@yourbrand.com"
                      value={waitlistEmail}
                      onChange={(e) => {
                        setWaitlistEmail(e.target.value);
                        setWaitlistError(undefined);
                      }}
                      aria-invalid={Boolean(waitlistError)}
                    />
                    {waitlistError && <ErrorText>{waitlistError}</ErrorText>}
                    <Button
                      type="button"
                      onClick={() => void submitWaitlist()}
                      disabled={status === "submitting"}
                      className="mt-4 h-13 w-full py-4 text-base font-bold"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Sending…
                        </>
                      ) : (
                        "Keep me posted"
                      )}
                    </Button>
                    {status === "error" && (
                      <p role="alert" className="mt-3 text-sm text-destructive">
                        We couldn't submit that just now. Please try again.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {screen === "done" && (
            <div className="rounded-md border border-signal/40 bg-signal-dim p-8 text-center">
              <CheckCircle2 className="mx-auto size-10 text-signal" strokeWidth={1.5} />
              <p className="mt-5 text-3xl font-extrabold text-headline-emphasis">
                Thanks{answers.fullName ? `, ${answers.fullName.split(" ")[0]}` : ""}, we've got your details.
              </p>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                A member of our team will review your eligibility and be in touch within one business day with
                your offer.
              </p>
              <Button asChild variant="outline" className="mt-7">
                <Link to="/capec">Back to CapEc</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-2xl font-extrabold leading-tight text-headline-emphasis sm:text-4xl">{children}</h1>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 text-sm text-destructive">
      {children}
    </p>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick} className="mt-6 h-13 w-full py-4 text-base font-bold sm:w-auto sm:px-10">
      Continue <ArrowRight className="size-4" />
    </Button>
  );
}

function CardStep({
  title,
  options,
  selected,
  onPick,
}: {
  title: string;
  options: string[];
  selected: string;
  onPick: (value: string) => void;
}) {
  return (
    <div>
      <StepTitle>{title}</StepTitle>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onPick(option)}
              aria-pressed={isSelected}
              className={`flex items-center justify-between gap-3 rounded-md border px-5 py-4 text-left text-base font-semibold transition-colors ${
                isSelected
                  ? "border-signal bg-signal text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-signal hover:bg-signal-dim"
              }`}
            >
              {option}
              {isSelected && <Check className="size-5 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
