import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { trackMetaLead } from "@/lib/meta-pixel";
import { Navbar, Footer } from "./capec";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thanks! | CapEc" },
      { name: "description", content: "We've got your details. CapEc will be in touch soon." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

// This page's own URL is the signal: only visitors who reach /thank-you were qualified by the lead
// form's criteria, so this is what a Meta conversion rule should be scoped to (e.g. a custom
// conversion matching "URL equals /thank-you"), not every form submission. Non-qualified visitors
// land on /not-qualified instead — see that route — and never reach this page or this pixel call.
function ThankYouPage() {
  useEffect(() => {
    void trackMetaLead();
  }, []);

  return (
    <div className="capec min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
            <CheckCircle2 className="mx-auto size-12 text-signal" strokeWidth={1.5} />
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-headline-emphasis sm:text-4xl">
              Thanks, we've got your details.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              A member of our team will review your eligibility and be in touch within one business
              day with your offer.
            </p>

            <div className="mx-auto mt-10 max-w-md rounded-xl border border-hairline bg-surface-subtle px-5 py-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What happens next
              </p>
              <ol className="mt-3 space-y-3">
                {[
                  "Our team reviews your details and confirms eligibility, usually within one business day.",
                  "We call or email you with your funding offer, including your first-deal fee.",
                  "If you accept, we move to funding your purchase order, no obligation to accept.",
                ].map((stepText, i) => (
                  <li key={stepText} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-signal text-xs font-bold text-header">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground">{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
