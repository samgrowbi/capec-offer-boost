import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { NOT_QUALIFIED_MESSAGE } from "@/lib/lead-qualification";
import { Navbar, Footer } from "./capec";

export const Route = createFileRoute("/not-qualified")({
  head: () => ({
    meta: [
      { title: "Thanks for your interest | CapEc" },
      { name: "description", content: "CapEc isn't a fit for this purchase order right now." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotQualifiedPage,
});

// Deliberately no trackMetaLead() call on this page. Its whole purpose is to be the one outcome a
// Meta conversion rule should NOT count — see /thank-you for the counted one.
function NotQualifiedPage() {
  return (
    <div className="capec min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
            <ShieldAlert className="mx-auto size-12 text-signal" strokeWidth={1.5} />
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-headline-emphasis sm:text-4xl">
              Thanks for your interest.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {NOT_QUALIFIED_MESSAGE}
            </p>
            <Link
              to="/capec"
              className="mt-7 inline-block text-sm font-semibold text-signal hover:underline"
            >
              Back to capec.io
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
