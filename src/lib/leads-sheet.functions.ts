import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SPREADSHEET_ID = "1oKWKeGVWmyxQ93iEGaLjER_I5Ad1-uaM6iosST22QZY";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

const COLUMNS = [
  ["created_at", "Submitted At"],
  ["source_slug", "Source"],
  ["lead_stage", "Stage"],
  ["full_name", "Full Name"],
  ["brand_name", "Business Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["online_store_url", "Store URL"],
  ["platform", "Platform"],
  ["revenue_range", "Revenue"],
  ["selling_history", "Selling History"],
  ["po_amount_range", "PO Amount"],
  ["business_country", "Country"],
  ["additional_notes", "Notes"],
  ["offer", "Offer"],
  ["utm_source", "UTM Source"],
  ["utm_medium", "UTM Medium"],
  ["utm_campaign", "UTM Campaign"],
] as const;

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

    // Write header row if the sheet is empty.
    const head = await fetch(`${base}/Sheet1!A1:A1`, { headers });
    if (head.ok) {
      const body = (await head.json()) as { values?: unknown[] };
      if (!body.values?.length) {
        await fetch(`${base}/Sheet1!A1:R1?valueInputOption=RAW`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ values: [COLUMNS.map(([, label]) => label)] }),
        });
      }
    }

    const row = COLUMNS.map(([key]) =>
      key === "created_at" ? new Date().toISOString() : ((data as Record<string, string | null | undefined>)[key] ?? ""),
    );
    const res = await fetch(`${base}/Sheet1!A:R:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
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
