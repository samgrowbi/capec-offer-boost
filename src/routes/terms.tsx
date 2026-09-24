import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer } from "./capec";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | CapEc" },
      {
        name: "description",
        content: "Read the terms and conditions for using CapEc's website, services, and funding solutions.",
      },
    ],
  }),
  component: TermsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-headline-emphasis">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function TermsPage() {
  return (
    <div className="capec min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <article className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h1 className="text-4xl font-extrabold leading-tight text-headline-emphasis sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Last update: July 1st, 2025</p>

          <Section title="Acceptance of Terms">
            <p>
              By accessing or using the services provided by CapEc Inc. ("CapEc," "we," "our," or "us"),
              you agree to comply with and be bound by these Terms and Conditions ("Terms"). If you do not
              agree with these Terms, you must refrain from using our services.
            </p>
          </Section>

          <Section title="Services Provided">
            <p>
              CapEc provides funding solutions to eCommerce businesses, including but not limited to
              inventory funding, cash flow optimization, and related financial services. The terms and
              conditions governing specific services may be outlined in separate agreements.
            </p>
          </Section>

          <Section title="Eligibility">
            <p>To be eligible for our services, you must:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Operate an eCommerce business with at least $100,000 in annual revenue.</li>
              <li>Have at least six months of sales history.</li>
              <li>Provide accurate and complete information during the application process.</li>
            </ul>
            <p>
              CapEc reserves the right to deny service to any business that does not meet these criteria
              or fails to comply with our requirements.
            </p>
          </Section>

          <Section title="Use of Services">
            <p>
              You agree to use our services only for lawful purposes and in compliance with all applicable
              laws and regulations. Unauthorized use of our services, including fraudulent activities, is
              strictly prohibited and may result in termination of services.
            </p>
          </Section>

          <Section title="Client Responsibilities">
            <p>Clients are responsible for:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Providing accurate and up-to-date information during the application process.</li>
              <li>
                Ensuring that all documents, including purchase orders and invoices, are submitted in the
                required format.
              </li>
              <li>Adhering to repayment schedules as outlined in their funding agreements.</li>
            </ul>
            <p>Failure to meet these responsibilities may result in the suspension or termination of services.</p>
          </Section>

          <Section title="Client Portal">
            <p>
              The Client Portal (app.capec.io) provided by CapEc aims to allow clients to view information
              related to the services contracted, solely for informational purposes.
            </p>
            <p>
              We make our best efforts to ensure the data displayed is accurate and up to date. However,
              technical, operational, or integration errors may result in discrepancies.
            </p>
            <p>
              In the event of any conflict between the data shown in the Portal and the content of
              contracts, commercial proposals, or official communications, the original documents shall
              prevail.
            </p>
            <p>
              It is the client's responsibility to regularly review the information shown and to promptly
              notify CapEc through official channels in case of any inconsistency or error. Failure to
              notify does not imply tacit acceptance of the data.
            </p>
            <p>
              CapEc shall not be held liable for decisions made solely based on the information displayed
              in the Portal without further validation through official channels.
            </p>
            <p>
              Use of the Portal implies the client's acknowledgment and acceptance that its content is for
              informational purposes only and subject to the limitations described above.
            </p>
          </Section>

          <Section title="Fees and Payments">
            <p>
              All fees associated with our services are outlined in the funding agreement provided to each
              client. Payments must be made in accordance with the agreed-upon schedule. Late payments may
              be subject to additional fees or penalties as specified in the agreement.
            </p>
          </Section>

          <Section title="Confidentiality">
            <p>
              CapEc will maintain the confidentiality of all client information in accordance with
              applicable data protection laws. Clients are responsible for maintaining the confidentiality
              of their login credentials and other sensitive information.
            </p>
          </Section>

          <Section title="Intellectual Property">
            <p>
              All content, logos, trademarks, and materials on the CapEc website and associated platforms
              are the intellectual property of CapEc Inc. and may not be used, reproduced, or distributed
              without our prior written consent.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              CapEc is not liable for any indirect, incidental, or consequential damages arising from the
              use of our services. Our liability is limited to the amount of fees paid by the client for
              the specific service in question.
            </p>
          </Section>

          <Section title="Termination">
            <p>
              CapEc reserves the right to terminate services at any time, with or without cause, upon
              providing notice to the client. Clients may also terminate their agreement with CapEc by
              providing written notice, subject to the terms of their funding agreement.
            </p>
          </Section>

          <Section title="Dispute Resolution and Arbitration">
            <p>
              Any disputes arising out of or in connection with these Terms shall be resolved through
              binding arbitration under the rules agreed to by the parties. The parties agree to waive any
              right to a trial by jury.
            </p>
          </Section>

          <Section title="Force Majeure">
            <p>
              CapEc shall not be held liable for any failure to perform under these Terms due to
              unforeseen events or circumstances beyond its control, including but not limited to natural
              disasters, strikes, or government regulations.
            </p>
          </Section>

          <Section title="Indemnification">
            <p>
              You agree to indemnify and hold harmless CapEc Inc. from any claims, losses, damages, or
              liabilities, including legal fees, arising out of your use of our services or breach of
              these Terms.
            </p>
          </Section>

          <Section title="Privacy and Data Protection">
            <p>
              Your use of our services is also governed by our{" "}
              <a href="/privacy" className="text-signal hover:underline">
                Privacy Policy
              </a>
              , which outlines how we collect, use, and protect your personal and business information. By
              using our services, you consent to the collection and processing of your data as outlined in
              our Privacy Policy.
            </p>
          </Section>

          <Section title="No Waiver">
            <p>
              Failure by CapEc to enforce any provision of these Terms shall not be deemed a waiver of
              such provision or of the right to enforce it in the future.
            </p>
          </Section>

          <Section title="Changes to Terms">
            <p>
              CapEc reserves the right to update or modify these Terms at any time. Changes will be
              effective immediately upon posting on our website. Continued use of our services after any
              changes constitutes acceptance of the new Terms.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms are governed by and construed in accordance with the laws of the State of
              Florida, without regard to its conflict of law principles.
            </p>
          </Section>

          <Section title="Contact Information">
            <p>For questions or concerns regarding these Terms, please contact us at:</p>
            <p>
              CapEc Inc.
              <br />
              3440 Hollywood Blvd Suite 415, Hollywood, FL 33021
              <br />
              Phone:{" "}
              <a href="tel:+17867445760" className="text-signal hover:underline">
                +1 786-744-5760
              </a>
            </p>
          </Section>

          <Section title="Entire Agreement">
            <p>
              These Terms constitute the entire agreement between you and CapEc regarding the use of our
              services and supersede all prior agreements or understandings.
            </p>
          </Section>

          <p className="mt-10 leading-relaxed text-muted-foreground">
            By using our services, you acknowledge that you have read, understood, and agreed to these
            Terms and Conditions.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
