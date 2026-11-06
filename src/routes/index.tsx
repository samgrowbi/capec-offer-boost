import { createFileRoute, redirect } from "@tanstack/react-router";

// This platform hosts per-client landing pages. The root sends visitors to the
// currently live client page.
//
// Keep the query string on the redirect: ad clicks land on "/" with gclid /
// gbraid / wbraid (Google) or fbclid + UTMs (Meta). Dropping them breaks
// Google Ads conversion attribution (no _gcl_aw cookie gets set) and the
// "Lead Source" / "Ad Name" columns in the leads sheet.
export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    throw redirect({ to: "/capec", search: location.search });
  },
  component: () => null,
});
