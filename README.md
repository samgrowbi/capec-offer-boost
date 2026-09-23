# CapEc Offer Accelerator

Build a single-page, high-converting landing page for CapEc (E-Commerce Capital Partners, capec.io), 
a fast inventory financing company for ecommerce and Amazon/private-label sellers. This page promotes 
a limited-time offer: a discounted financing fee on the client's first funded deal. The page lives at 
the route /capec within our existing multi-client landing page platform (React + Tailwind + Supabase), 
matching the visual system, form-submission pattern, and mobile responsiveness of our other client LPs 
on growbi.co.

BRAND & TONE
Confident, fast-moving, founder-friendly fintech — not corporate-bank, not hypey-startup. The implicit 
comparison in the reader's mind is banks and other revenue-based-finance providers, so copy should read 
as faster and more flexible than that category, without naming competitors directly. Dark navy/charcoal 
base with a single accent color (electric blue or green), clean modern fintech aesthetic, generous 
whitespace, bold sans-serif headlines.

PAGE STRUCTURE

1. Sticky navbar: CapEc logo left, anchor links (How It Works / Who We Fund / FAQ), persistent CTA 
   button "Get Your Offer" right, scrolls to lead form.

2. Hero section:
   - Headline centered on the offer (give me 3 variants to A/B test), e.g. "Fund Your Next Restock — 
     Your First Deal, At a Discounted Rate."
   - Subhead: approvals in 24 hours, fund up to 2.5x monthly sales, no credit checks, no personal 
     guarantees.
   - Offer badge/ribbon: "Limited-Time: [X]% Off Your First Deal's Financing Fee" — drive this off a 
     discountPercent variable near the top of the file so it's a one-line edit later.
   - Primary CTA → scrolls to lead form. Secondary link "See how it works" → scrolls to How It Works.
   - Abstract visual motif (inventory/boxes/growth line) — no stock photos of people.

3. Trust bar: 3–4 stat callouts — "20+ Years of Ecommerce Experience," "80%+ Approval Rate on Private 
   Label," "Fund up to 75% of your PO," "Approved in as little as 24 hours." Large number + small label.

4. The offer, explained: 3-step block (Apply → connect store, approved in 24hrs / Fund your first 
   restock → discounted flat fee, no interest, no hidden costs / Scale from there → future deals at 
   standard rates, priority terms as you grow). Include a simple before/after fee example with 
   placeholder numbers I can edit ("Standard fee: $X,XXX → Your first-deal fee: $X,XXX").

5. Why CapEc grid: 4–6 icon + short-copy cards — No credit checks, No personal guarantees, No financials 
   required, Flat fee (no interest), 45-day grace period after invoice due before repayments begin, Only 
   collateral is the funded inventory itself.

6. Who we fund (eligibility checklist): 6+ months sales history, $100K+ annual revenue, existing 
   ASINs/SKUs (not brand-new products), private label preferred, sellers based in US/CA/EU/UK.

7. Social proof: testimonial carousel, 3 short quotes (founder name + brand + one line on scaling 
   without losing control). Mark clearly as placeholder content for me to swap with real quotes.

8. FAQ accordion: What is inventory financing / How much can I get / What's the rate (flat fee, not 
   interest) / What happens if I can't repay on time / How does the first-deal discount work / Is there 
   a catch. Short, plain-language, confident answers.

9. Final CTA section: repeat the offer + lead form.

10. Lead capture form (4–6 fields max, low friction):
    - Business/brand name
    - Monthly or annual revenue (dropdown range, not exact figure)
    - Ecommerce platform (dropdown: Amazon, Shopify, Both, Other)
    - Work email
    - Phone (optional)
    - Hidden fields: source_slug: "capec", offer: "first-deal-discount", utm_source, utm_medium, 
      utm_campaign captured from URL params on load
    - Submit button: "Get My Funding Offer"
    - On submit: write to our existing Supabase leads table (add the two new fields above as columns if 
      they don't already exist), show an inline success state ("Thanks — a member of our team will reach 
      out within one business day") rather than redirecting away.

11. Footer: CapEc logo, one-line disclaimer ("CapEc is not a bank. Financing is subject to approval."), 
    Privacy Policy / Terms placeholder links, social icons (LinkedIn, Instagram, X).

TECHNICAL REQUIREMENTS
- Fully responsive, mobile-first (most traffic lands on mobile from Meta)
- Fast load — SVG/icon components over photos where possible, no heavy unoptimized images
- Form validation with inline error states, disable submit while submitting, graceful error/retry 
  handling on Supabase write failures
- Smooth-scroll anchor navigation
- Offer percentage, headline copy, and testimonial content as easily-editable constants/props near the 
  top of the component, so copy can be tweaked without touching layout code

DESIGN DISCIPLINE
Avoid generic AI-page tells: no tracked-out ALL-CAPS eyebrow labels above every heading, no single-word 
accent-color highlight in the headline, no identical rounded SaaS cards with the same soft shadow on 
everything, no numbered 01/02/03 markers unless the content is genuinely a sequence (the 3-step "how it 
works" block qualifies; nothing else should use that pattern). Pick one deliberate color/type system 
specific to a fintech-for-ecommerce-operators brief, not a default template look. Spend visual boldness 
in one place — most likely the hero offer badge or the fee comparison — and keep everything else 
disciplined and quiet.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://capec-offer-boost.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6293fe0d-dfad-4e88-bc34-2b85e3a82b5a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
