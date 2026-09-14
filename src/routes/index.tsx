import { createFileRoute, redirect } from "@tanstack/react-router";

// This platform hosts per-client landing pages. The root sends visitors to the
// currently live client page.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/capec" });
  },
  component: () => null,
});
