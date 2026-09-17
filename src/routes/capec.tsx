import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  BadgeDollarSign,
  BarChart3,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  Handshake,
  Headphones,
  Instagram,
  Linkedin,
  MapPin,
  PackageCheck,
  Play,
  ReceiptText,
  Rocket,
  ShoppingBag,
  Store,
  TrendingUp,
  UserRoundCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { LeadForm } from "@/components/capec/LeadForm";
import amazonLogo from "@/assets/capec/amazon-logo.png";
import capecLogo from "@/assets/capec/capec-logo.png.asset.json";
import danielPhoto from "@/assets/capec/daniel-lilienthal.png.asset.json";
import nadavPhoto from "@/assets/capec/nadav-gorlicki.png.asset.json";
import { PARTNERS } from "@/assets/capec/partners";
import shopifyLogo from "@/assets/capec/shopify-logo.svg";

const discountPercent = 25;
const LOGO_SRC = capecLogo.url;

type CapecVideo = {
  youtubeId: string;
  title: string;
};

const CAPEC_VIDEOS: CapecVideo[] = [
  { youtubeId: "oZD_RWU6hqo", title: "" },
  { youtubeId: "R4EPPCYZA6I", title: "" },
  { youtubeId: "igkFsdMq8n0", title: "" },
  { youtubeId: "GO8c_QwS7P0", title: "" },
  { youtubeId: "cvIPEosmYqM", title: "" },
];

const BENEFITS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  { icon: Zap, title: "Fast approval", body: "Get a decision in 24 hours." },
  {
    icon: BadgeDollarSign,
    title: "Keep more cash",
    body: `${discountPercent}% off the fee on your first funded deal.`,
  },
  { icon: FileCheck2, title: "Simple process", body: "Share your store and revenue range to start." },
  { icon: Headphones, title: "Professional support", body: "Work directly with a team that knows ecommerce." },
];

const STEPS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Store,
    title: "Apply",
    body: "Connect your store, tell us your revenue range. No financials, no tax returns. You'll hear back in 24 hours.",
  },
  {
    icon: UserRoundCheck,
    title: "Get Approved",
    body: "Get a clear funding decision in 24 hours so you can move on your order.",
  },
  {
    icon: Rocket,
    title: "Fund your first Order",
    body: `Take your first order funded at ${discountPercent}% off our standard fee. Flat fee, no interest, no surprise draw costs.`,
  },
];

const DIFFERENTIATORS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: BarChart3,
    title: "Sales history leads the decision",
    body: "Your sales history is the decision, not your credit score.",
  },
  {
    icon: Handshake,
    title: "Keep personal assets separate",
    body: "You don't put your house or savings behind a purchase order.",
  },
  {
    icon: ReceiptText,
    title: "One flat fee",
    body: "Agreed up front. Nothing compounds while you sell through.",
  },
  {
    icon: Clock3,
    title: "45 days to sell",
    body: "Repayments start 45 days after your invoice is due.",
  },
  {
    icon: Boxes,
    title: "Inventory is the collateral",
    body: "Nothing else on your balance sheet is at risk.",
  },
  {
    icon: Check,
    title: "No long-term contract / one deal at a time",
    body: "Fund one PO at a time. No standing commitment to keep borrowing.",
  },
];

const REQUIREMENTS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  { icon: TrendingUp, title: "Sales History", body: "We fund brands selling for over 6 months." },
  { icon: ShoppingBag, title: "Private Label", body: "For best results, we focus on private label products." },
  { icon: CircleDollarSign, title: "Minimum Revenue", body: "Annual revenue that exceeds $100,000." },
  {
    icon: PackageCheck,
    title: "Existing Products",
    body: "We fund existing ASINs/SKUs (new products not eligible).",
  },
  { icon: MapPin, title: "Location", body: "Brands selling in the US, CA, EU, or UK (based anywhere)." },
];

const FAQS = [
  {
    q: "What is inventory financing?",
    a: "Capital raised against your purchase order to help you buy the inventory needed to supply the sale. We finance the purchase order today and collect on the accounts receivable once the invoice is due.",
  },
  {
    q: "How much can I get?",
    a: "Up to $1M on your first round. [PLACEHOLDER: exact mechanic for how the limit grows after that - confirm with client]",
  },
  {
    q: "What's the rate?",
    a: `A flat fee, agreed before you accept - not compounding interest. Your first deal gets ${discountPercent}% off that fee.`,
  },
  {
    q: "What happens if I can't repay on time?",
    a: "You'll have a 45-day grace period after your invoice is due. If you still need more time, we'll work with you on your terms first. The inventory funded is our only collateral - we don't come after your personal assets.",
  },
  {
    q: `How does the ${discountPercent}% first-deal discount work?`,
    a: "It applies automatically to the financing fee on your first funded deal. No code, no separate application.",
  },
  {
    q: "Is there a catch?",
    a: "No. The discount is on the fee, not a teaser rate that resets higher later - your second deal moves to our standard pricing, which we'll show you upfront before you commit to anything.",
  },
];

const CTA_LABEL = "Fund Your Purchase Order Today";

export const Route = createFileRoute("/capec")({
  head: () => ({
    meta: [
      { title: "CapEc Purchase Order Funding | 25% First-Deal Discount" },
      {
        name: "description",
        content: "Fund ecommerce purchase orders with a 24-hour decision and 25% off your first funded deal's fee.",
      },
      { property: "og:title", content: "CapEc Purchase Order Funding" },
      {
        property: "og:description",
        content: "Get a 24-hour funding decision and 25% off your first funded deal's fee.",
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
  component: CapecPage,
});

function CapecPage() {
  return (
    <div className="capec min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <KeyBenefits />
        <VideoTestimonials />
        <HowItWorks />
        <WhyCapec />
        <StatBreak />
        <FundingRequirements />
        <OurPartners />
        <FounderTrust />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <a href="#top" className="inline-flex items-center" aria-label="CapEc home">
      <img
        src={LOGO_SRC}
        alt="CapEc"
        className={`h-8 w-auto ${inverse ? "" : "rounded-sm bg-header px-1.5 py-1"}`}
      />
    </a>
  );
}

function Navbar() {
  const links = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#why-capec", label: "Why CapEc" },
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <header id="top" className="sticky top-0 z-50 border-b border-header-border bg-header text-header-foreground">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <Wordmark inverse />
        <nav className="hidden items-center gap-8 text-sm text-header-muted md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-header-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <Button asChild className="h-auto max-w-[12rem] whitespace-normal px-3 py-2 text-center text-xs sm:max-w-none sm:px-5 sm:text-sm">
          <a href="#offer-form">{CTA_LABEL}</a>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:items-center lg:gap-10 lg:px-8 lg:py-10">
        <div className="order-1 flex flex-col lg:order-2">
          <h1 className="order-2 mt-5 max-w-2xl text-4xl font-extrabold leading-[1.05] text-headline-secondary sm:text-6xl lg:order-1 lg:mt-0 lg:text-6xl">
            <span className="text-headline-emphasis">Fund Your Purchase Order</span> Today
          </h1>
          <div className="order-1 max-w-xl rounded-md bg-signal p-4 text-primary-foreground sm:p-5 lg:order-2 lg:mt-5">
            <div className="text-5xl font-extrabold sm:text-6xl">{discountPercent}% off</div>
            <p className="mt-2 text-sm font-semibold sm:text-base">your first funded deal's financing fee</p>
          </div>
          <div className="order-3 mt-5 flex items-start gap-3 text-headline-emphasis sm:items-center">
            <Clock3 className="mt-0.5 size-6 shrink-0 text-signal sm:mt-0" aria-hidden="true" />
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
              <span className="font-bold">Approval in 24 hours</span>
              <span className="text-muted-foreground sm:border-l sm:border-border sm:pl-3">Fund up to 2.5x your monthly sales.</span>
            </p>
          </div>
          <p className="order-4 mt-3 text-sm text-muted-foreground">Financing is subject to approval.</p>
        </div>
        <div className="order-2 rounded-md border border-border bg-card p-5 shadow-capec sm:p-6 lg:order-1">
          <p className="mb-4 text-lg font-bold text-headline-emphasis">Get your funding offer</p>
          <LeadForm formId="capec-hero-lead-form" />
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ label, title, copy }: { label?: string; title: string; copy?: string }) {
  return (
    <div className="max-w-2xl">
      {label && <p className="mb-3 text-sm font-bold text-signal">{label}</p>}
      <h2 className="text-3xl font-extrabold leading-tight text-headline-emphasis sm:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{copy}</p>}
    </div>
  );
}

function KeyBenefits() {
  return (
    <section className="border-b border-border bg-surface-subtle">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="text-3xl font-extrabold leading-tight text-headline-emphasis sm:text-5xl lg:whitespace-nowrap">Funding that keeps your next order moving.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-md border border-border bg-card p-6">
              <div className="grid size-10 place-items-center rounded-md bg-signal-dim text-signal">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-headline-emphasis">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoTestimonials() {
  const [videos, setVideos] = useState(CAPEC_VIDEOS);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all(
      CAPEC_VIDEOS.map(async (video) => {
        try {
          const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.youtubeId}&format=json`,
            { signal: controller.signal },
          );
          if (!response.ok) return { ...video, title: "CapEc Video" };
          const data = (await response.json()) as { title?: string };
          return { ...video, title: data.title?.trim() || "CapEc Video" };
        } catch {
          return { ...video, title: "CapEc Video" };
        }
      }),
    ).then((resolvedVideos) => {
      if (!controller.signal.aborted) setVideos(resolvedVideos);
    });

    return () => controller.abort();
  }, []);

  const scrollCarousel = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Placeholder section wording. The CapEc team will finalize this heading. */}
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            label="CapEc channel"
            title="Straight from CapEc"
            copy="A closer look at how ecommerce sellers fund their next order."
          />
          <div className="hidden shrink-0 gap-2 sm:flex" aria-label="Video carousel controls">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scrollCarousel(-1)}
              aria-label="Previous videos"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scrollCarousel(1)}
              aria-label="Next videos"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:gap-6"
          aria-label="CapEc videos"
        >
          {videos.map((video) => (
            <VideoCard key={video.youtubeId} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({ video }: { video: CapecVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const title = video.title || "CapEc Video";

  return (
    <article className="w-[88%] shrink-0 snap-start overflow-hidden rounded-md border border-border bg-card sm:w-[65%] lg:w-[calc((100%_-_3rem)/3)]">
      <div className="aspect-video bg-signal-dim">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={title}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="group relative size-full rounded-none p-0"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${title}`}
          >
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt=""
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-header/15 transition-colors group-hover:bg-header/25" aria-hidden="true" />
            <span className="absolute grid size-14 place-items-center rounded-full bg-signal text-primary-foreground shadow-capec transition-transform group-hover:scale-105">
              <Play className="ml-1 size-6" fill="currentColor" aria-hidden="true" />
            </span>
          </Button>
        )}
      </div>
      <div className="p-5">
        <p className="font-bold leading-snug text-headline-emphasis">{title}</p>
      </div>
    </article>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-b border-border bg-surface-subtle">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading label="How it works" title="From application to funded order in three steps." />
        <ol className="mt-12 grid gap-8 lg:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="border-t-2 border-signal pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="size-7 text-signal" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-headline-emphasis">{title}</h3>
                </div>
                <span className="text-sm font-bold text-muted-foreground">0{index + 1}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhyCapec() {
  return (
    <section id="why-capec" className="scroll-mt-16 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          label="Why CapEc"
          title="Terms designed around how ecommerce sells."
          copy="Our team reviews your application with your sales history and purchase order in view."
        />
        <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIATORS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="border-t border-border pt-5">
              <div className="flex items-center gap-3">
                <Icon className="size-6 shrink-0 text-signal" aria-hidden="true" />
                <h3 className="font-bold text-headline-emphasis">{title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatBreak() {
  return (
    <section className="bg-headline-emphasis text-primary-foreground" aria-label="Funding highlights">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-header-border px-5 sm:px-6 lg:grid-cols-4 lg:px-8">
        {[
          { value: "24hrs", label: "Approval" },
          { value: "25%", label: "Off your first deal's fee" },
          { value: "$1M", label: "Up to on your first round" },
          { value: "100%", label: "Of your PO funded" },
        ].map((stat) => (
          <div key={stat.label} className="bg-headline-emphasis px-4 py-5 sm:px-7 sm:py-6">
            <p className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-header-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FundingRequirements() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-headline-emphasis sm:text-5xl">Funding Requirements:</h2>
          <p className="mt-4 text-lg text-muted-foreground">We support sellers across:</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12" aria-label="Supported platforms">
            <img src={amazonLogo} alt="Amazon" className="h-auto w-36 object-contain sm:w-44" />
            <img src={shopifyLogo} alt="Shopify" className="h-auto w-36 object-contain sm:w-44" />
          </div>
        </div>
        <div className="mt-12 grid overflow-hidden rounded-md bg-signal text-primary-foreground sm:grid-cols-2 lg:grid-cols-5">
          {REQUIREMENTS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="border-b border-primary-foreground/20 p-6 last:border-b-0 sm:border-r lg:border-b-0">
              <Icon className="size-7" aria-hidden="true" />
              <h3 className="mt-5 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurPartners() {
  return (
    <section className="overflow-hidden border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
        <h2 className="text-3xl font-extrabold text-headline-emphasis sm:text-5xl">Our Partners</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Part of a growing network of ecommerce service providers, logistics, and finance partners.
        </p>
      </div>
      <div className="capec-partners-marquee group mt-10 pb-16 sm:mt-12 sm:pb-24" aria-label="CapEc partners">
        <div className="capec-partners-track">
          {[0, 1].map((setIndex) => (
            <div className="capec-partners-set" aria-hidden={setIndex === 1} key={setIndex}>
              {PARTNERS.map((partner) => (
                <a
                  key={`${setIndex}-${partner.name}`}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capec-partner-link"
                  aria-label={`Visit ${partner.name}`}
                  tabIndex={setIndex === 1 ? -1 : undefined}
                >
                  <img src={partner.logo} alt={setIndex === 0 ? partner.name : ""} className="capec-partner-logo" />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderTrust() {
  return (
    <section className="border-b border-border bg-surface-subtle">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          label="The team behind CapEc"
          title="Ecommerce funding with people on the other side."
          copy="Meet Nadav and Daniel, the co-founders behind CapEc's purchase order financing."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-16">
          <FounderCard
            name="Nadav Gorlicki"
            role="CEO & Co-Founder"
            src={nadavPhoto.url}
            bio="With a wealth of experience spanning over a decade in eCommerce, he is an industry leader in supply chain optimization and digital marketplace strategies. Gain from his insights, he knows that for the maximum impact, a funding solution should not only offer capital but also serve as a seamless extension of the eCommerce seller's supply chain."
          />
          <FounderCard
            name="Daniel Lilienthal"
            role="COO & Co-Founder"
            src={danielPhoto.url}
            bio="With more than 15 years of hands-on experience in the financial sector, Daniel is a seasoned authority in financial solutions and services. His expertise underscores the belief that a truly valuable financial solution should effortlessly integrate into day-to-day operations, offering simplicity and accessibility."
          />
        </div>
      </div>
    </section>
  );
}

function FounderCard({ name, role, src, bio }: { name: string; role: string; src: string; bio: string }) {
  const socials = [
    { icon: Linkedin, href: "https://www.linkedin.com/company/capecinc", label: "CapEc on LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/capec.io/", label: "CapEc on Instagram" },
  ];
  return (
    <article className="flex flex-col items-center text-center">
      <img
        src={src}
        alt={`${name}, ${role}`}
        className="size-64 max-w-full rounded-none object-cover sm:size-72 lg:size-[300px]"
      />
      <h3 className="mt-6 text-xl font-bold text-headline-emphasis">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{role}</p>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{bio}</p>
      <div className="mt-5 flex items-center gap-4 text-muted-foreground">
        {socials.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-9 place-items-center rounded-full border border-border transition-colors hover:border-signal hover:text-signal"
          >
            <Icon className="size-4" aria-hidden="true" />
          </a>
        ))}
      </div>
    </article>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHeading label="FAQ" title="Straight answers before you apply." />
        <Accordion type="single" collapsible className="mt-10">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q} className="border-border">
              <AccordionTrigger className="text-left text-base font-bold text-headline-emphasis hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="offer-form" className="scroll-mt-16 bg-surface-subtle">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:items-start lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-24">
          <p className="text-sm font-bold text-signal">{discountPercent}% off your first funded deal's fee</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-headline-emphasis sm:text-6xl">{CTA_LABEL}</h2>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">Approval in 24 hours. Fund up to 2.5x your monthly sales.</p>
          <p className="mt-5 text-sm text-muted-foreground">Financing is subject to approval.</p>
        </div>
        <div className="rounded-md border border-border bg-card p-5 shadow-capec sm:p-8">
          <LeadForm formId="capec-lead-form" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">CapEc is not a bank. Financing is subject to approval.</p>
        </div>
        <div className="flex flex-col gap-6 sm:items-end">
          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#" aria-label="CapEc on LinkedIn" className="hover:text-signal"><Linkedin className="size-4" /></a>
            <a href="#" aria-label="CapEc on Instagram" className="hover:text-signal"><Instagram className="size-4" /></a>
            <a href="#" aria-label="CapEc on X" className="hover:text-signal"><XIcon className="size-4" /></a>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CapEc | capec.io</p>
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