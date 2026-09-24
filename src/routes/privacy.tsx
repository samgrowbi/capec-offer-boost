import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer } from "./capec";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | CapEc" },
      {
        name: "description",
        content: "Review CapEc's privacy practices and how we protect your personal and business information.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="capec min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <article className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h1 className="text-4xl font-extrabold leading-tight text-headline-emphasis sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-8 leading-relaxed text-muted-foreground">
            Any personal information on our web site, either by visiting the "Registration" page or by
            placing an order, you can be assured that our company is the only one who will use it. We do
            not rent, sell, or otherwise distribute any information from our customer database, including
            e-mail addresses.
          </p>

          <h2 className="mt-10 text-xl font-bold text-headline-emphasis">Information Collection and Use</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We value our customers and their privacy. We collect store, use, and share customer
            information in accordance with this policy. We may store information you enter on our
            website, including your account information. We use your personal information to ensure
            efficient processing of your order, to communicate with you, and to improve our website,
            services, and products. We sometimes send offers to select groups of customers on behalf of
            other businesses. When we do this, we may help our partners verify the effectiveness of their
            offers to our customers. We will not sell or share identifiable personal information to any
            third party, except in accordance with this privacy policy or unless we are required to do so
            by law.
          </p>

          <h2 className="mt-10 text-xl font-bold text-headline-emphasis">Security</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            All personal information necessary to complete your order is stored in our system is kept on
            servers that are locked in our secure data center. All information transmitted to our servers
            via the website is encrypted using state of the art encryption technology, facilitated by our
            Extended Validation SSL certificate.
          </p>

          <h2 className="mt-10 text-xl font-bold text-headline-emphasis">Communications</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We will use your personal information to communicate with you about our Site and your orders.
            All customers must provide an email address to allow communication regarding orders placed. We
            may send you a confirmation email after you register with us as well as service-related
            announcements as necessary. You may also submit your email to sign up for our email newsletter
            and special offers. You can unsubscribe or opt out of future emails at any time.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            By providing your phone number during registration or subscribing, you agree to receive text
            messages from CapEc Inc. Message &amp; data rates may apply. Message frequency varies. Reply
            STOP to opt out, reply HELP for help.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Text messaging originator opt-in data and consent will not be shared with any third parties or
            affiliates for marketing or promotional purposes, under any circumstance.
          </p>

          <h2 className="mt-10 text-xl font-bold text-headline-emphasis">Credit Card Information</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            To ensure your safety online, we maintain strict PCI compliance and do not store credit card
            numbers on our servers.
          </p>

          <h2 className="mt-10 text-xl font-bold text-headline-emphasis">Changes to This Privacy Policy</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We reserve the right to update or change our Privacy Policy at any time and you should check
            this Privacy Policy periodically. Your continued use of the Service after we post any
            modifications to the Privacy Policy on this page will constitute your acknowledgment of the
            modifications and your consent to abide and be bound by the modified Privacy Policy. If we
            make any material changes to this Privacy Policy, we will notify you either through the email
            address you have provided us, or by placing a prominent notice on our website.
          </p>

          <h2 className="mt-10 text-xl font-bold text-headline-emphasis">Contact Us</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {/* capec.io obfuscates its email via Cloudflare email-protection, so the address couldn't be
                read from the source page — confirm the real one with the client before this goes live. */}
            Phone:{" "}
            <a href="tel:+17862445174" className="text-signal hover:underline">
              +1 (786)-244-5174
            </a>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
