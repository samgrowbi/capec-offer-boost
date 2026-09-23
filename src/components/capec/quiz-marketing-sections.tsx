// Shared marketing sections reused on /quiz to give the funnel's intro screen
// proper landing-page content. Content is intentionally duplicated from
// /capec (not imported from src/routes/capec.tsx) so /capec's route file
// stays completely untouched. If copy changes on /capec, mirror the change
// here too.
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Handshake,
  Play,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

import danielPhoto from "@/assets/capec/daniel-lilienthal.png.asset.json";
import nadavPhoto from "@/assets/capec/nadav-gorlicki.png.asset.json";
import { PARTNERS } from "@/assets/capec/partners";

const discountPercent = 25;

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

export function SectionHeading({ label, title, copy }: { label?: string; title: string; copy?: string }) {
  return (
    <div className="mx-auto text-center">
      {label && <p className="mb-3 text-sm font-bold text-signal">{label}</p>}
      <h2 className="text-3xl font-extrabold leading-tight text-headline-emphasis sm:text-5xl lg:text-[clamp(2rem,3.4vw,2.75rem)]">{title}</h2>
      {copy && <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{copy}</p>}
    </div>
  );
}

export function StatBreak() {
  return (
    <section className="bg-headline-emphasis text-primary-foreground" aria-label="Funding highlights">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-header-border px-5 sm:px-6 lg:grid-cols-4 lg:px-8">
        {[
          { value: "24hrs", label: "Approval" },
          { value: "25%", label: "Off your first deal's fee" },
          { value: "$1M", label: "Up to on your first round" },
          { value: "1,000+", label: "POs Funded" },
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

export function QuizWhyCapec() {
  return (
    <section className="border-b border-border bg-background">
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

export function QuizVideoTestimonials() {
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
        <div className="relative">
          <SectionHeading
            label="CapEc channel"
            title="Straight from CapEc"
            copy="A closer look at how ecommerce sellers fund their next order."
          />
          <div className="absolute right-0 top-1 hidden shrink-0 gap-2 sm:flex" aria-label="Video carousel controls">
            <Button type="button" variant="outline" size="icon" onClick={() => scrollCarousel(-1)} aria-label="Previous videos">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => scrollCarousel(1)} aria-label="Next videos">
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div ref={carouselRef} className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:gap-6" aria-label="CapEc videos">
          {videos.map((video) => (
            <QuizVideoCard key={video.youtubeId} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuizVideoCard({ video }: { video: CapecVideo }) {
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

export function QuizOurPartners() {
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

export function QuizFounderTrust() {
  return (
    <section className="border-b border-border bg-surface-subtle">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          label="The team behind CapEc"
          title="Ecommerce funding with people on the other side."
          copy="Meet Nadav and Daniel, the co-founders behind CapEc's purchase order financing."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-16">
          <QuizFounderCard
            name="Nadav Gorlicki"
            role="CEO & Co-Founder"
            src={nadavPhoto.url}
            bio="With a wealth of experience spanning over a decade in eCommerce, he is an industry leader in supply chain optimization and digital marketplace strategies. Gain from his insights, he knows that for the maximum impact, a funding solution should not only offer capital but also serve as a seamless extension of the eCommerce seller's supply chain."
          />
          <QuizFounderCard
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

function QuizFounderCard({ name, role, src, bio }: { name: string; role: string; src: string; bio: string }) {
  return (
    <article className="flex flex-col items-center pb-4 text-center">
      <img
        src={src}
        alt={`${name}, ${role}`}
        className="size-64 max-w-full rounded-full object-cover object-center sm:size-72 lg:size-[300px]"
      />
      <h3 className="mt-6 text-xl font-bold text-headline-emphasis">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{role}</p>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{bio}</p>
    </article>
  );
}

export function QuizFaq() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading label="FAQ" title="Straight answers before you apply." />
        <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl">
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
