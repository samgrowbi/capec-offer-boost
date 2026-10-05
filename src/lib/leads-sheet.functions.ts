import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { COLUMNS, colLetter, planLayout, rowFor, type ColumnKey } from "@/lib/sheet-layout";
import { NOT_QUALIFIED_STAGE } from "@/lib/lead-qualification";

const SPREADSHEET_ID = "1oKWKeGVWmyxQ93iEGaLjER_I5Ad1-uaM6iosST22QZY";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const QUALIFIED_TAB = "Sheet1";
const NOT_QUALIFIED_TAB = "NonQualified";

const str = z.string().max(2000).nullish();
const leadSchema = z.object(
  Object.fromEntries(COLUMNS.filter(([k]) => k !== "created_at").map(([k]) => [k, str])) as Record<
    string,
    typeof str
  >,
);

// Reads a tab's header row. If the tab itself doesn't exist yet (the common case for "NonQualified"
// the first time a non-qualified lead comes in), creates it and reads again. Returns null if the
// header row genuinely can't be determined (read failed for a reason other than a missing tab, or
// the create/retry also failed) — the caller falls back to the known default layout in that case.
async function ensureTab(base: string, headers: Record<string, string>, tab: string): Promise<string[] | null> {
  const head = await fetch(`${base}/${encodeURIComponent(tab)}!1:1`, { headers });
  if (head.ok) {
    const body = (await head.json()) as { values?: unknown[][] };
    return (body.values?.[0] ?? []).map((c) => String(c ?? ""));
  }
  // Not necessarily a missing tab (could be a transient error), but attempting to create it is safe
  // either way: Sheets rejects adding a sheet whose title already exists, so this is a no-op if the
  // tab is actually already there for some other reason.
  const spreadsheetBase = base.replace(/\/values$/, "");
  const create = await fetch(`${spreadsheetBase}:batchUpdate`, {
    method: "POST",
    headers,
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab } } }] }),
  });
  if (!create.ok) {
    console.error(`Sheets tab create failed [${create.status}] for "${tab}": ${await create.text()}`);
    return null;
  }
  const retry = await fetch(`${base}/${encodeURIComponent(tab)}!1:1`, { headers });
  if (!retry.ok) {
    console.error(`Sheets header read failed after creating tab "${tab}" [${retry.status}]: ${await retry.text()}`);
    return null;
  }
  const body = (await retry.json()) as { values?: unknown[][] };
  return (body.values?.[0] ?? []).map((c) => String(c ?? ""));
}

export const appendLeadToSheet = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => leadSchema.parse(d))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];
    if (!lovableKey || !sheetsKey) {
      console.error("Google Sheets credentials missing");
      return { ok: false };
    }
    const headers = {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": sheetsKey,
      "Content-Type": "application/json",
    };
    const base = `${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}/values`;

    // Non-qualified leads go to their own tab, so the two populations never mix in the sheet the
    // team actually looks at.
    const tab = (data as Partial<Record<ColumnKey, string | null | undefined>>)["lead_stage"] === NOT_QUALIFIED_STAGE
      ? NOT_QUALIFIED_TAB
      : QUALIFIED_TAB;

    // Place each value under the header with the matching name (see sheet-layout.ts). The team edits
    // this sheet by hand, so writing by fixed column position puts values under the wrong heading the
    // moment a column is reordered, renamed, or inserted — that already happened once in production.
    const existing = await ensureTab(base, headers, tab);
    const { layout, write } = planLayout(existing);
    if (write) {
      const range = `${tab}!${colLetter(write.startCol)}1:${colLetter(write.startCol + write.labels.length - 1)}1`;
      const put = await fetch(`${base}/${range}?valueInputOption=RAW`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ values: [write.labels] }),
      });
      if (!put.ok) console.error(`Sheets header write failed [${put.status}]: ${await put.text()}`);
    }

    const values: Partial<Record<ColumnKey, string | null | undefined>> = {
      ...(data as Partial<Record<ColumnKey, string | null | undefined>>),
      created_at: new Date().toISOString(),
    };
    const row = rowFor(layout, values);
    const res = await fetch(`${base}/${tab}!A:${colLetter(layout.length)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      headers,
      body: JSON.stringify({ values: [row] }),
    });
    if (!res.ok) {
      console.error(`Sheets append failed [${res.status}]: ${await res.text()}`);
      return { ok: false };
    }
    return { ok: true };
  });
