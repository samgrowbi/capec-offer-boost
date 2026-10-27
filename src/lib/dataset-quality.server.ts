// Meta Dataset Quality API (server only).
// Reads Events Manager quality metrics for the CapEc pixel/dataset: Event Match Quality,
// event coverage, dedup feedback, data freshness and additional conversions reported (ACR).
// Token comes from the META_DATASET_QUALITY_TOKEN secret — never hard-code it or send it to the browser.

export const CAPEC_DATASET_ID = "624600358549348"; // same ID as the Meta Pixel in meta-pixel.ts

const GRAPH_VERSION = "v21.0";
const WEB_FIELDS = [
  "event_name",
  "event_match_quality",
  "event_coverage",
  "dedupe_key_feedback",
  "data_freshness",
  "acr",
  "event_potential_aly_acr_increase",
].join(",");

export type DatasetQualityResult =
  | { ok: true; datasetId: string; fetchedAt: string; summary: EventSummary[]; raw: unknown }
  | { ok: false; status: number; error: string };

export type EventSummary = { event: string; emq: number | null };

export async function fetchDatasetQuality(datasetId = CAPEC_DATASET_ID): Promise<DatasetQualityResult> {
  const token = process.env["META_DATASET_QUALITY_TOKEN"];
  if (!token) return { ok: false, status: 500, error: "META_DATASET_QUALITY_TOKEN is not set" };

  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/dataset_quality`);
  url.searchParams.set("dataset_id", datasetId);
  url.searchParams.set("fields", `web{${WEB_FIELDS}}`);

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const body = (await res.json().catch(() => null)) as
    | { web?: Array<Record<string, unknown>>; error?: { message?: string } }
    | null;

  if (!res.ok || !body || body.error) {
    const error = body?.error?.message ?? `Meta returned HTTP ${res.status}`;
    console.error(`Dataset Quality API failed for ${datasetId}: ${error}`);
    return { ok: false, status: res.ok ? 502 : res.status, error };
  }

  const summary: EventSummary[] = (body.web ?? []).map((e) => {
    const emq = e["event_match_quality"] as { composite_score?: unknown } | undefined;
    const score = Number(emq?.composite_score);
    return { event: String(e["event_name"] ?? "unknown"), emq: Number.isFinite(score) ? score : null };
  });

  return { ok: true, datasetId, fetchedAt: new Date().toISOString(), summary, raw: body };
}
