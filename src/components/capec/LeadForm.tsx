import { useEffect, useState } from "react";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

const REVENUE_RANGES = [
  "$100K – $250K / year",
  "$250K – $500K / year",
  "$500K – $1M / year",
  "$1M – $5M / year",
  "$5M+ / year",
  "Under $100K / year",
];

const PLATFORMS = ["Amazon", "Shopify", "Both", "Other"];

const schema = z.object({
  brandName: z
    .string()
    .trim()
    .min(2, { message: "Enter your business or brand name" })
    .max(120, { message: "Keep this under 120 characters" }),
  revenueRange: z.string().min(1, { message: "Select a revenue range" }),
  platform: z.string().min(1, { message: "Select your platform" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Enter your work email" })
    .email({ message: "That email doesn't look right" })
    .max(255, { message: "Keep this under 255 characters" }),
  phone: z
    .string()
    .trim()
    .max(30, { message: "Keep this under 30 characters" })
    .optional()
    .or(z.literal("")),
});

type Fields = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
  brandName: "",
  revenueRange: "",
  platform: "",
  email: "",
  phone: "",
};

const fieldClass =
  "w-full bg-ink-deep/60 border border-input px-3.5 py-3 text-[0.95rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal";

export function LeadForm({ formId }: { formId: string }) {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [utm, setUtm] = useState({ utm_source: "", utm_medium: "", utm_campaign: "" });

  // Hidden campaign fields, captured from the URL on load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    });
  }, []);

  const set = (key: keyof Fields) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Fields;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    const { error } = await supabase.from("leads").insert({
      brand_name: parsed.data.brandName,
      revenue_range: parsed.data.revenueRange,
      platform: parsed.data.platform,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
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
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="border border-signal/40 bg-signal-dim p-8 text-center">
        <CheckCircle2 className="mx-auto size-8 text-signal" strokeWidth={1.5} />
        <p className="capec-display mt-4 text-2xl">Thanks — you're in.</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A member of our team will reach out within one business day to walk through your
          numbers and lock in your first-deal rate.
        </p>
      </div>
    );
  }

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="space-y-4">
      <Field label="Business / brand name" htmlFor={`${formId}-brand`} error={errors.brandName}>
        <input
          id={`${formId}-brand`}
          name="brandName"
          className={fieldClass}
          placeholder="Northline Supply Co."
          value={values.brandName}
          onChange={(e) => set("brandName")(e.target.value)}
          aria-invalid={Boolean(errors.brandName)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Revenue" htmlFor={`${formId}-revenue`} error={errors.revenueRange}>
          <select
            id={`${formId}-revenue`}
            name="revenueRange"
            className={fieldClass}
            value={values.revenueRange}
            onChange={(e) => set("revenueRange")(e.target.value)}
            aria-invalid={Boolean(errors.revenueRange)}
          >
            <option value="">Select a range</option>
            {REVENUE_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Platform" htmlFor={`${formId}-platform`} error={errors.platform}>
          <select
            id={`${formId}-platform`}
            name="platform"
            className={fieldClass}
            value={values.platform}
            onChange={(e) => set("platform")(e.target.value)}
            aria-invalid={Boolean(errors.platform)}
          >
            <option value="">Select one</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Work email" htmlFor={`${formId}-email`} error={errors.email}>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          inputMode="email"
          className={fieldClass}
          placeholder="you@yourbrand.com"
          value={values.email}
          onChange={(e) => set("email")(e.target.value)}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>

      <Field
        label="Phone"
        hint="optional"
        htmlFor={`${formId}-phone`}
        error={errors.phone}
      >
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          className={fieldClass}
          placeholder="+1 555 000 1234"
          value={values.phone ?? ""}
          onChange={(e) => set("phone")(e.target.value)}
          aria-invalid={Boolean(errors.phone)}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group flex w-full items-center justify-center gap-2 bg-signal px-6 py-4 font-display text-[0.95rem] font-bold tracking-tight text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Get My Funding Offer
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          We couldn't submit that just now. Please press the button again — if it keeps
          failing, email us at funding@capec.io.
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        No credit pull. No obligation. We only use your details to prepare your offer.
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 flex items-baseline gap-2 text-xs font-medium text-muted-foreground"
      >
        {label}
        {hint && <span className="text-muted-foreground/60">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
