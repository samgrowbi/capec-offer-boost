import { createFileRoute } from "@tanstack/react-router";
import { fetchDatasetQuality } from "@/lib/dataset-quality.server";

// GET /api/dataset-quality[?dataset_id=...]
// Internal only: requires `Authorization: Bearer <DATASET_QUALITY_ROUTE_KEY>`.
export const Route = createFileRoute("/api/dataset-quality")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = process.env["DATASET_QUALITY_ROUTE_KEY"];
        if (!key) return new Response("Server configuration error", { status: 500 });

        const provided = /^Bearer (\S+)$/.exec(request.headers.get("authorization") ?? "")?.[1] ?? "";
        const { createHash, timingSafeEqual } = await import("node:crypto");
        const digest = (v: string) => createHash("sha256").update(v, "utf8").digest();
        if (!provided || !timingSafeEqual(digest(provided), digest(key))) {
          return new Response("Unauthorized", { status: 401 });
        }

        const datasetId = new URL(request.url).searchParams.get("dataset_id") ?? undefined;
        if (datasetId && !/^\d{5,25}$/.test(datasetId)) {
          return Response.json({ ok: false, error: "Invalid dataset_id" }, { status: 400 });
        }

        const result = await fetchDatasetQuality(datasetId);
        return Response.json(result, {
          status: result.ok ? 200 : result.status,
          headers: { "cache-control": "no-store" },
        });
      },
    },
  },
});
