import { useEffect, useState } from "react";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  onlineStoreUrl: z
    .string()
    .trim()
    .min(3, { message: "Enter your online store URL" })
    .max(300, { message: "Keep this under 300 characters" }),
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
    .min(6, { message: "Enter your phone number" })
    .max(30, { message: "Keep this under 30 characters" }),
});

type Fields = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
  brandName: "",
  onlineStoreUrl: "",
  revenueRange: "",
  platform: "",
  email: "",
  phone: "",
};

const fieldClass =
  "w-full bg-background border border-input px-3.5 py-3 text-[0.95rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal";

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
      online_store_url: parsed.data.onlineStoreUrl,
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
        <p className="mt-4 text-2xl font-extrabold text-headline-emphasis">Thanks, you're in.</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks - a member of our team will reach out within one business day.
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

      <Field
        label="Online Store URL"
        htmlFor={`${formId}-store-url`}
        error={errors.onlineStoreUrl}
        help="For Amazon, please share your Storefront URL."
      >
        <input
          id={`${formId}-store-url`}
          name="onlineStoreUrl"
          type="text"
          inputMode="url"
          className={fieldClass}
          placeholder="https://yourbrand.com"
          value={values.onlineStoreUrl}
          onChange={(e) => set("onlineStoreUrl")(e.target.value)}
          aria-invalid={Boolean(errors.onlineStoreUrl)}
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

      <Field label="Phone" htmlFor={`${formId}-phone`} error={errors.phone}>
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

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="group h-12 w-full px-6 text-[0.95rem] font-bold"
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
      </Button>

      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          We couldn't submit that just now. Please press the button again. If it keeps
          failing, email us at funding@capec.io.
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        No obligation. We only use your details to prepare your offer.
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  help,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: string | undefined;
  help?: string | undefined;
  htmlFor: string;
  error?: string | undefined;
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
      {help && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/80">{help}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
