import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Boxes,
  CalendarClock,
  FileX2,
  Instagram,
  Linkedin,
  Receipt,
  Check,
} from "lucide-react";

import { LeadForm } from "@/components/capec/LeadForm";
import { Testimonials, type Testimonial } from "@/components/capec/Testimonials";

/* =================================================================
 * EDITABLE COPY: change anything in this block without touching layout
 * ================================================================= */

/** One-line edit: drives every mention of the promo discount. */
const discountPercent = 25;

/** Headline A/B variants. Set ACTIVE_HEADLINE to 0, 1 or 2. */
const HEADLINES = [
  "Fund Your Next Restock. Your First Deal, At a Discounted Rate.",
  "Inventory Capital in 24 Hours. Your First Deal Costs Less.",
  "Stop Selling Out of Stock. Fund Your Restock at a First-Deal Discount.",
];
const ACTIVE_HEADLINE = 0;
const [HEADLINE_EMPHASIS = "", ...HEADLINE_REMAINDER] =
  (HEADLINES[ACTIVE_HEADLINE] ?? "").split(". ");

const SUBHEAD =
  "Approvals in 24 hours. Fund up to 2.5x your monthly sales.";

/** Before/after fee example. Placeholder numbers, edit freely. */
const FEE_EXAMPLE = {
  dealSize: "$100,000 purchase order",
  standardFee: "$10,000",
  discountedFee: "$7,500",
  savings: "$2,500 stays in your business",
};

const STATS = [
  { value: "20+", label: "Years of ecommerce experience" },
  { value: "80%+", label: "Approval rate on private label" },
  { value: "100%", label: "Of your PO funded" },
  { value: "24hrs", label: "Approval" },
];

const STEPS = [
  {
    title: "Apply",
    body: "Connect your store and share a revenue range. No financials, no tax returns. You hear back within 24 hours.",
  },
  {
    title: "Fund your first Order",
    body: `Take your first order funded at ${discountPercent}% off our standard fee. Flat fee, no interest, no surprise draw costs.`,
  },
  {
    title: "Scale from there",
    body: "Future deals move at standard rates, with priority terms and larger limits as your track record with us grows.",
  },
];

const REASONS = [
  { icon: FileX2, title: "No financials required", body: "No audited statements, no tax returns, no month-long underwriting." },
  { icon: Receipt, title: "Flat fee, not interest", body: "One number, agreed up front. Nothing compounds while you sell through." },
  { icon: CalendarClock, title: "45-day grace period", body: "Repayments start 45 days after the invoice due date, giving you room to actually sell." },
  { icon: Boxes, title: "Inventory is the only collateral", body: "The funded inventory secures the deal. Nothing else on your balance sheet." },
];

const ELIGIBILITY = [
  "6+ months of sales history",
  "$100K+ in annual revenue",
  "Existing ASINs / SKUs with sales data, not brand-new launches",
  "Private label preferred",
  "Sellers based in the US, Canada, EU or UK",
  "Purchase orders for physical inventory",
];

/** PLACEHOLDER TESTIMONIALS: swap with real client quotes before launch. */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We doubled our Q4 order without giving up a single point of equity. The capital showed up before our supplier deadline.",
    name: "Placeholder Name",
    brand: "Placeholder Brand",
  },
  {
    quote:
      "Our bank wanted two years of statements. CapEc wanted our sales history and got back to us the next day.",
    name: "Placeholder Name",
    brand: "Placeholder Brand",
  },
  {
    quote:
      "Three restocks funded, zero personal guarantees. We finally stopped rationing inventory to protect cash.",
    name: "Placeholder Name",
    brand: "Placeholder Brand",
  },
];

const FAQS = [
  {
    q: "What is inventory financing?",
    a: "Capital raised against your purchase order to help you buy the inventory needed to supply the sale. We finance the purchase order today and collect on the accounts receivable once the invoice is due.",
  },
  {
    q: "How much can I get?",
    a: "Up to $1M on the first round. Your limit grows as your track record with us builds.",
  },
  {
    q: "What's the rate?",
    a: "It's a flat fee, not an interest rate. You agree to one number up front and that number never changes. Nothing compounds, and there's no penalty for selling through early.",
  },
  {
    q: "What happens if I can't repay on time?",
    a: "Talk to us early. Repayments only begin 45 days after the invoice due date, and we'd rather restructure a schedule around a slow sell-through than force a default.",
  },
  {
    q: `How does the ${discountPercent}% first-deal discount work?`,
    a: `Apply during the promotional window and your first funded deal's financing fee is reduced by ${discountPercent}%. It's applied automatically to your first term sheet. Later deals price at standard rates.`,
  },
  {
    q: "Is there a catch?",
    a: "No equity, no warrants, no lien on your business beyond the funded inventory. The discount applies to one deal, your first one, and it exists so you can test us with real money on the line.",
  },
];

/* ================================================================= */

const offerLine = `Limited-Time: ${discountPercent}% Off Your First Deal's Financing Fee`;

export const Route = createFileRoute("/capec")({
  head: () => ({
    meta: [
      { title: `CapEc Inventory Financing | ${discountPercent}% Off Your First Deal` },
      {
        name: "description",
        content:
          "Fast inventory financing for Amazon and private-label sellers. Approvals in 24 hours and funding up to 2.5x monthly sales.",
      },
      { property: "og:title", content: `CapEc | ${discountPercent}% Off Your First Funded Deal` },
      {
        property: "og:description",
        content:
          "Inventory capital for ecommerce operators with a flat fee and 45-day grace period.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: CapecPage,
});

function CapecPage() {
  return (
    <div className="capec min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <OfferExplained />
        <WhyCapec />
        <WhoWeFund />
        <SocialProof />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-2 ${className}`}>
      <span className="grid size-7 place-items-center bg-signal font-display text-[0.8rem] font-extrabold text-primary-foreground">
        C
      </span>
      <span className="capec-display text-lg">CapEc</span>
    </a>
  );
}

const NAV = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#who-we-fund", label: "Who We Fund" },
  { href: "#faq", label: "FAQ" },
];

function Navbar() {
  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-header-border bg-header text-header-foreground"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-header-muted md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-header-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#offer-form"
          className="bg-signal px-4 py-2.5 font-display text-sm font-bold tracking-tight text-primary-foreground transition-opacity hover:opacity-90"
        >
          Fund Your Purchase Order Today
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-4xl px-5 pt-16 pb-20 text-center sm:pt-24 sm:pb-28 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:items-center lg:gap-16 lg:text-left">
        <div className="lg:col-start-2 lg:row-start-1">
          {/* the one deliberately loud element on the page */}
          <div className="mx-auto inline-flex items-stretch border border-signal/50 bg-signal-dim lg:mx-0">
            <span className="bg-signal px-3 py-2 font-mono text-[0.7rem] font-medium tracking-widest text-primary-foreground">
              {discountPercent}% OFF
            </span>
            <span className="px-3 py-2 text-left font-mono text-[0.7rem] leading-tight tracking-wide text-signal sm:leading-normal">
              Limited-time: your first deal's financing fee
            </span>
          </div>

          <h1 className="capec-display mx-auto mt-8 max-w-3xl text-[2.35rem] text-headline-secondary sm:text-6xl lg:mx-0">
            <span className="text-headline-emphasis">
              {HEADLINE_EMPHASIS}.
            </span>{" "}
            {HEADLINE_REMAINDER.join(". ")}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            {SUBHEAD}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="#offer-form"
              className="group inline-flex w-full items-center justify-center gap-2 bg-signal px-7 py-4 font-display font-bold tracking-tight text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Fund Your Purchase Order Today
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="mt-14 border border-border bg-card p-6 text-left sm:p-8 lg:col-start-1 lg:row-start-1 lg:mt-0">
          <LeadForm formId="capec-hero-lead-form" />
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-b border-hairline bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 px-5 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`py-8 md:py-10 ${i % 2 === 1 ? "border-l border-hairline pl-5" : "pr-5"} ${
              i < 2 ? "border-b border-hairline md:border-b-0" : ""
            } ${i === 2 ? "md:border-l md:border-hairline md:pl-5" : ""} ${
              i === 3 ? "md:pl-5" : ""
            }`}
          >
            <div className="capec-display text-3xl text-signal sm:text-4xl">{stat.value}</div>
            <div className="mt-2 max-w-[14ch] text-xs leading-snug text-muted-foreground sm:text-sm">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OfferExplained() {
  return (
    <section id="how-it-works" className="border-b border-hairline scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <h2 className="capec-display max-w-2xl text-3xl sm:text-4xl">
          The offer, in three moves.
        </h2>

        <ol className="mt-12 grid gap-px bg-hairline md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="bg-background p-7">
              <span className="font-mono text-sm text-signal">0{i + 1}</span>
              <h3 className="capec-display mt-4 text-xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        {/* fee comparison: the second place we spend visual weight */}
        <div className="mt-14 border border-signal/30 bg-card/50">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline px-6 py-4">
            <span className="font-display text-sm font-bold">Example deal</span>
            <span className="font-mono text-xs text-muted-foreground">
              {FEE_EXAMPLE.dealSize}
            </span>
          </div>
          <div className="grid sm:grid-cols-2">
            <div className="border-b border-hairline px-6 py-8 sm:border-b-0 sm:border-r">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Standard fee · 10% flat fee
              </div>
              <div className="capec-display mt-3 text-4xl text-muted-foreground line-through decoration-2">
                {FEE_EXAMPLE.standardFee}
              </div>
            </div>
            <div className="bg-signal-dim px-6 py-8">
              <div className="font-mono text-xs uppercase tracking-widest text-signal">
                First-deal fee after {discountPercent}% discount
              </div>
              <div className="capec-display mt-3 text-4xl text-signal sm:text-5xl">
                {FEE_EXAMPLE.discountedFee}
              </div>
              <div className="mt-2 font-mono text-xs text-muted-foreground">
                 {FEE_EXAMPLE.savings}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyCapec() {
  return (
    <section className="border-b border-hairline bg-card">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <h2 className="capec-display max-w-2xl text-3xl sm:text-4xl">
          Built for operators, not underwriters.
        </h2>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {REASONS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="capec-rule pt-5">
              <Icon className="size-5 text-signal" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-base font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoWeFund() {
  return (
    <section id="who-we-fund" className="border-b border-hairline scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <h2 className="capec-display text-3xl sm:text-4xl">Who we fund.</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            We back sellers with a proven product and a supply problem, not first-time
            launches. If you tick most of these, you're likely a fit.
          </p>
          <a
            href="#offer-form"
            className="mt-7 inline-flex items-center gap-2 font-display text-sm font-bold tracking-tight text-signal"
          >
            Check your eligibility
            <ArrowRight className="size-4" />
          </a>
        </div>
        <ul className="space-y-px bg-hairline">
          {ELIGIBILITY.map((item) => (
            <li key={item} className="flex items-start gap-3 bg-background px-5 py-4">
              <Check className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={2.5} />
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="border-b border-hairline bg-card">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="capec-display text-3xl sm:text-4xl">Operators who restocked on time.</h2>
          <span className="font-mono text-xs text-muted-foreground">
            Placeholder quotes. Swap before launch
          </span>
        </div>
        <Testimonials testimonials={TESTIMONIALS} />
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="border-b border-hairline scroll-mt-16">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
        <h2 className="capec-display text-3xl sm:text-4xl">Straight answers.</h2>
        <Accordion type="single" collapsible className="mt-10">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q} className="border-hairline">
              <AccordionTrigger className="text-left font-display text-base font-bold tracking-tight hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="offer-form" className="bg-surface-subtle scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-2 lg:items-start">
        <div>
          <div className="inline-flex items-center border border-signal/50 bg-signal-dim px-3 py-1.5 font-mono text-[0.7rem] tracking-wide text-signal">
            {offerLine}
          </div>
          <h2 className="capec-display mt-6 text-3xl sm:text-5xl">
            Get your funding offer in 24 hours.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Tell us four things about your business. We'll come back with a real number, a
            flat fee, and your first-deal discount already applied.
          </p>
          <ul className="mt-8 space-y-3">
            {["45-day grace period after invoice due"].map(
              (item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="size-4 shrink-0 text-signal" strokeWidth={2.5} />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="border border-border bg-card p-6 sm:p-8">
          <LeadForm formId="capec-lead-form" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
            CapEc is not a bank. Financing is subject to approval. E-Commerce Capital
            Partners.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:items-end">
          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#" aria-label="CapEc on LinkedIn" className="transition-colors hover:text-signal">
              <Linkedin className="size-4" />
            </a>
            <a href="#" aria-label="CapEc on Instagram" className="transition-colors hover:text-signal">
              <Instagram className="size-4" />
            </a>
            <a href="#" aria-label="CapEc on X" className="transition-colors hover:text-signal">
              <XIcon className="size-4" />
            </a>
          </div>
          <p className="font-mono text-[0.7rem] text-muted-foreground/70">
            © {new Date().getFullYear()} CapEc | capec.io
          </p>
        </div>
      </div>
    </footer>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.9 2H22l-7.1 8.1L23 22h-6.8l-4.7-6.2L5.9 22H2.8l7.5-8.6L1.6 2h6.9l4.4 5.8L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z" />
    </svg>
  );
}
