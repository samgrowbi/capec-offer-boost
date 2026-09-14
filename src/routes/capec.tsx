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
  ShieldOff,
  UserRoundX,
  Check,
} from "lucide-react";

import { InventoryMotif } from "@/components/capec/Motif";
import { LeadForm } from "@/components/capec/LeadForm";
import { Testimonials, type Testimonial } from "@/components/capec/Testimonials";

/* =================================================================
 * EDITABLE COPY: change anything in this block without touching layout
 * ================================================================= */

/** One-line edit: drives every mention of the promo discount. */
const discountPercent = 25;

/** Headline A/B variants. Set ACTIVE_HEADLINE to 0, 1 or 2. */
const HEADLINES = [
  "25% Off Your First Restock. Approved in 24 Hours.",
  "Inventory Capital in 24 Hours. Your First Deal Costs Less.",
  "Stop Selling Out of Stock. Fund Your Restock at a First-Deal Discount.",
];
const ACTIVE_HEADLINE = 0;

const SUBHEAD =
  "Fund up to 2.5x your monthly sales with no credit checks and no personal guarantees. Your first funded deal gets 25% off the financing fee.";

/** Before/after fee example. Placeholder numbers, edit freely. */
const FEE_EXAMPLE = {
  dealSize: "$100,000 purchase order",
  standardFee: "$8,000",
  discountedFee: "$6,000",
  savings: "$2,000",
};

const STATS = [
  { value: "20+", label: "Years of ecommerce experience" },
  { value: "80%+", label: "Approval rate on private label" },
  { value: "75%", label: "Of your PO funded" },
  { value: "24hrs", label: "Approval, at the fastest" },
];

const STEPS = [
  {
    title: "Apply",
    body: "Connect your store, tell us your revenue range. No financials, no tax returns — you'll hear back in 24 hours.",
  },
  {
    title: "Fund your first restock",
    body: "Take your first restock funded at 25% off our standard fee. Flat fee, no interest, no surprise draw costs.",
  },
  {
    title: "Scale from there",
    body: "Come back for your next PO at standard rates — with priority terms and bigger limits once you've got a track record with us.",
  },
];

const REASONS = [
  { icon: ShieldOff, title: "No credit checks", body: "Your sales history is the decision — not your credit score." },
  { icon: UserRoundX, title: "No personal guarantees", body: "You don't put your house or your savings behind a purchase order." },
  { icon: FileX2, title: "No financials required", body: "No audited statements, no tax returns, no month-long underwriting." },
  { icon: Receipt, title: "Flat fee, not interest", body: "One flat fee, agreed up front. Nothing compounds while you sell through." },
  { icon: CalendarClock, title: "45-day grace period", body: "45 days after your invoice is due — real time to actually sell." },
  { icon: Boxes, title: "Inventory is the only collateral", body: "The inventory you're funding is the only collateral. Nothing else on your balance sheet is at risk." },
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
    a: "Capital to buy or produce the stock you need to fulfill an order — paid back once it sells, not before.",
  },
  {
    q: "How much can I get?",
    a: "Up to 2.5x your monthly sales, or up to 75% of a specific purchase order, based on your sales history.",
  },
  {
    q: "What's the rate?",
    a: "A flat fee, agreed before you accept — not compounding interest. Your first deal gets 25% off that fee.",
  },
  {
    q: "What happens if I can't repay on time?",
    a: "We'll work with you on your terms first. The inventory funded is our only collateral — we don't come after your personal assets.",
  },
  {
    q: `How does the ${discountPercent}% first-deal discount work?`,
    a: "It applies automatically to the financing fee on your first funded deal. No code, no separate application.",
  },
  {
    q: "Is there a catch?",
    a: "No. The discount is on the fee, not a teaser rate that resets higher later — your second deal moves to our standard pricing, which we'll show you upfront before you commit to anything.",
  },
];

/* ================================================================= */

// PLACEHOLDER: swap in a real expiry date once the client confirms one,
// e.g. "Offer ends [DATE]". Do not fabricate a countdown or deadline.
const offerLine = `First-deal pricing — available while we're onboarding new brands this quarter.`;

export const Route = createFileRoute("/capec")({
  head: () => ({
    meta: [
      { title: `CapEc Inventory Financing | ${discountPercent}% Off Your First Deal` },
      {
        name: "description",
        content:
          "Fast inventory financing for Amazon and private-label sellers. Approvals in 24 hours, up to 2.5x monthly sales, no credit checks or personal guarantees.",
      },
      { property: "og:title", content: `CapEc | ${discountPercent}% Off Your First Funded Deal` },
      {
        property: "og:description",
        content:
          "Inventory capital for ecommerce operators. Flat fee, 45-day grace period, no personal guarantees.",
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
      className="sticky top-0 z-50 border-b border-hairline bg-ink/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#offer-form"
          className="bg-signal px-4 py-2.5 font-display text-sm font-bold tracking-tight text-primary-foreground transition-opacity hover:opacity-90"
        >
          See My Discounted Offer
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-ink">
      <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-[420px] max-w-3xl bg-signal/10 blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-5 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
        {/* the one deliberately loud element on the page */}
        <div className="mx-auto inline-flex items-stretch border border-signal/50 bg-signal-dim">
          <span className="bg-signal px-3 py-2 font-mono text-[0.7rem] font-medium tracking-widest text-primary-foreground">
            {discountPercent}% OFF
          </span>
          <span className="px-3 py-2 text-left font-mono text-[0.7rem] leading-tight tracking-wide text-signal sm:leading-normal">
            First-deal pricing — available while we're onboarding new brands this quarter.
          </span>
        </div>

        <h1 className="capec-display mx-auto mt-8 max-w-3xl text-[2.35rem] sm:text-6xl">
          {HEADLINES[ACTIVE_HEADLINE]}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {SUBHEAD}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#offer-form"
            className="group inline-flex w-full items-center justify-center gap-2 bg-signal px-7 py-4 font-display font-bold tracking-tight text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            See My Discounted Offer
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            See how it works
          </a>
        </div>

        <InventoryMotif className="mx-auto mt-14 w-full max-w-2xl text-foreground" />
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-b border-hairline">
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
              {FEE_EXAMPLE.dealSize} | placeholder figures
            </span>
          </div>
          <div className="grid sm:grid-cols-2">
            <div className="border-b border-hairline px-6 py-8 sm:border-b-0 sm:border-r">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Standard fee
              </div>
              <div className="capec-display mt-3 text-4xl text-muted-foreground line-through decoration-2">
                {FEE_EXAMPLE.standardFee}
              </div>
            </div>
            <div className="bg-signal-dim px-6 py-8">
              <div className="font-mono text-xs uppercase tracking-widest text-signal">
                Your first-deal fee
              </div>
              <div className="capec-display mt-3 text-4xl text-signal sm:text-5xl">
                {FEE_EXAMPLE.discountedFee}
              </div>
              <div className="mt-2 font-mono text-xs text-muted-foreground">
                {FEE_EXAMPLE.savings} stays in your business
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
    <section className="border-b border-hairline bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <h2 className="capec-display max-w-2xl text-3xl sm:text-4xl">
          Built for operators, not underwriters.
        </h2>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
    <section className="border-b border-hairline bg-ink">
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
    <section id="offer-form" className="bg-ink-deep scroll-mt-16">
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
            {["No credit check to get an offer", "No personal guarantee", "45-day grace period after invoice due"].map(
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
    <footer className="border-t border-hairline bg-ink">
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
