# CapEc layout and branding updates

## Scope
- Tighten the hero so the next section is visible sooner, place the sales multiple beside the approval message, and remove the standalone hero CTA while retaining the form submission button.
- Keep the Key Benefits heading on one line at desktop widths.
- Place each How It Works and Why CapEc heading beside its icon, and add the requested one-deal-at-a-time differentiator.
- Make the four-column stat band shorter and remove the 100% asterisk and internal note.
- Replace only the Amazon and Shopify placeholders with official logo assets, preserving the rest of Funding Requirements.

## Technical details
- Update the existing `/capec` route markup and Tailwind classes only; preserve form behavior, copy not named in the request, and all other sections.
- Store official logo files locally in the project so the page does not depend on third-party hotlinks.
- Verify desktop and mobile layouts, section visibility, logo rendering, and the clean preview build.
