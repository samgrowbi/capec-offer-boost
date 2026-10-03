import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { COLUMNS, colLetter, planLayout, rowFor, type ColumnKey } from "@/lib/sheet-layout";

const SPREADSHEET_ID = "1oKWKeGVWmyxQ93iEGaLjER_I5Ad1-uaM6iosST22QZY";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

const str = z.string().max(2000).nullish();
const leadSchema = z.object(
  Object.fromEntries(COLUMNS.filter(([k]) => k !== "created_at").map(([k]) => [k, str])) as Record<
    string,
    typeof str
  >,
);

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
    const tab = "Sheet1";

    // Place each value under the header with the matching name (see sheet-layout.ts). The team edits
    // this sheet by hand, so writing by fixed column position puts values under the wrong heading the
    // moment a column is reordered, renamed, or inserted — that already happened once in production.
    let existing: string[] | null = null;
    const head = await fetch(`${base}/${tab}!1:1`, { headers });
    if (head.ok) {
      const body = (await head.json()) as { values?: unknown[][] };
      existing = (body.values?.[0] ?? []).map((c) => String(c ?? ""));
    } else {
      console.error(`Sheets header read failed [${head.status}]: ${await head.text()}; using the known layout`);
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
