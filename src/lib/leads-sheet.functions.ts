import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NOT_QUALIFIED_STAGE } from "@/lib/lead-qualification";
import { COLUMNS, colLetter, planLayout, rowFor, type ColumnKey } from "@/lib/sheet-layout";

const SPREADSHEET_ID = "1oKWKeGVWmyxQ93iEGaLjER_I5Ad1-uaM6iosST22QZY";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

// Qualified leads keep going to the original tab. Non-qualified leads get their own tab so they
// can be worked as a separate funnel, and so any automation watching the main tab (for example
// one that sends conversions to Meta) never sees them. The tab name has no spaces or symbols on
// purpose so it never needs quoting in A1 notation.
const QUALIFIED_TAB = "Sheet1";
const NOT_QUALIFIED_TAB = "NonQualified";

const str = z.string().max(2000).nullish();
const leadSchema = z.object(
  Object.fromEntries(COLUMNS.filter(([k]) => k !== "created_at" && k !== "qualified").map(([k]) => [k, str])) as Record<
    string,
    typeof str
  >,
);

type Headers = Record<string, string>;

async function tabExists(headers: Headers, tab: string): Promise<boolean | null> {
  const res = await fetch(`${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties.title`, { headers });
  if (!res.ok) {
    console.error(`Sheets metadata failed [${res.status}]: ${await res.text()}`);
    return null;
  }
  const body = (await res.json()) as { sheets?: { properties?: { title?: string } }[] };
  return Boolean(body.sheets?.some((s) => s.properties?.title === tab));
}

// Creates the tab if it doesn't exist yet. Returns false if it can't be confirmed to exist.
async function ensureTab(headers: Headers, tab: string): Promise<boolean> {
  const exists = await tabExists(headers, tab);
  if (exists) return true;
  if (exists === null) return false;
  const add = await fetch(`${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}:batchUpdate`, {
    method: "POST",
    headers,
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab } } }] }),
  });
  if (add.ok) return true;
  console.error(`Sheets addSheet failed [${add.status}]: ${await add.text()}`);
  // Two first-ever submissions can race to create the tab; if it exists now, carry on.
  return (await tabExists(headers, tab)) === true;
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

    const isNotQualified = data["lead_stage"] === NOT_QUALIFIED_STAGE;
    const tab = isNotQualified ? NOT_QUALIFIED_TAB : QUALIFIED_TAB;

    // Fail closed: if the non-qualified tab can't be confirmed, do NOT fall back to the main tab.
    // The lead is already saved in the database, and writing it to the main tab could make a
    // non-qualified lead look like a conversion.
    if (isNotQualified && !(await ensureTab(headers, tab))) {
      console.error(`Non-qualified tab "${tab}" unavailable; lead kept in database only`);
      return { ok: false };
    }

    // "Qualified" is set here, from the same rule that picked the tab, so the flag and the tab can never
    // disagree and callers can't forget it. Written in the same append as the row, so anything triggered
    // by a new row already sees the final Yes/No.
    const values: Partial<Record<ColumnKey, string | null | undefined>> = {
      ...(data as Partial<Record<ColumnKey, string | null | undefined>>),
      created_at: new Date().toISOString(),
      qualified: isNotQualified ? "No" : "Yes",
    };

    // Place each value under the header with the matching name (see sheet-layout.ts). The team edits
    // this sheet by hand, so writing by fixed column position would put values under the wrong heading.
    let existing: string[] | null = null;
    const head = await fetch(`${base}/${tab}!1:1`, { headers });
    if (head.ok) {
      const body = (await head.json()) as { values?: unknown[][] };
      existing = (body.values?.[0] ?? []).map((c) => String(c ?? ""));
    } else {
      console.error(`Sheets header read failed [${head.status}]: ${await head.text()}; using the standard layout`);
    }
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
