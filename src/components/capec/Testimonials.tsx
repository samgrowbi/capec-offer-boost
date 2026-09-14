import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export type Testimonial = { quote: string; name: string; brand: string };

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="mt-10">
      <CarouselContent className="-ml-4">
        {testimonials.map((t, i) => (
          <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <figure className="flex h-full flex-col justify-between border-l-2 border-signal bg-card/40 p-6">
              <blockquote className="text-[1.05rem] leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {t.name} — {t.brand}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-6 flex gap-2">
        <CarouselPrevious className="static size-9 translate-y-0 rounded-none border-border bg-transparent hover:bg-accent" />
        <CarouselNext className="static size-9 translate-y-0 rounded-none border-border bg-transparent hover:bg-accent" />
      </div>
    </Carousel>
  );
}
