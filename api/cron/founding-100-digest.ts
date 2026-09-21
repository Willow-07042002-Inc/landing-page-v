// GET /api/cron/founding-100-digest — nightly Founding 100 sign-up digest.
//
// Scheduled by the `crons` entry in vercel.json for 01:00 UTC, which is 9pm
// New York (8pm when the clock falls back). It reports everyone who signed up
// since midnight New York time on the day it runs.
//
// It sends every night, including nights with no sign-ups: a "no sign-ups
// today" line is a cheap confirmation that the pipeline is still alive, so a
// quiet inbox is never ambiguous between "nobody signed up" and "it broke".

import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
// .js extensions are required: package.json sets "type": "module", so Vercel
// compiles these functions with NodeNext resolution. Without them the build
// logs TS2835 but still deploys, and the function dies at runtime with
// FUNCTION_INVOCATION_FAILED.
import { adminClient } from "../_lib.js";
import { parseFirmDetails, FIRM_FIELDS, FOUNDING_100_FORM_TYPE } from "../../src/lib/founding100.js";

const TIMEZONE = "America/New_York";
const DIGEST_TO = process.env.FOUNDING_100_DIGEST_TO ?? "aaronburlacoff@willow-inc.com";

/* Midnight in New York, as a UTC instant. Derived from the offset the zone is
   actually using tonight, so it stays correct across daylight saving. */
export function startOfTodayInNewYork(now: Date): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  // How far into the New York day we are, subtracted from the current instant.
  const msIntoDay =
    ((get("hour") % 24) * 60 * 60 + get("minute") * 60 + get("second")) * 1000 +
    now.getMilliseconds();
  return new Date(now.getTime() - msIntoDay);
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Row = { name: string | null; email: string; message: string | null; created_at: string };

export function buildHtml(rows: Row[], dayLabel: string): string {
  /* One stacked block per sign-up rather than a wide table. Six columns of
     firm detail overflow the 720px an email gets, and this is read on a phone
     in the evening — stacked rows never clip and need no horizontal scroll. */
  const label = 'style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8A93A0;padding:0 12px 0 0;white-space:nowrap;"';
  const value = 'style="font-size:14px;color:#222222;padding:0 0 6px;"';

  const card = (r: Row) => {
    const firm = parseFirmDetails(r.message);
    const detail = firm
      ? FIRM_FIELDS.map((f, i) => [f, firm[i]] as const)
      // Unrecognised message shape: show it whole rather than drop it.
      : [["Details", r.message ?? "—"] as const];
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE, hour: "numeric", minute: "2-digit",
    }).format(new Date(r.created_at));
    return `<tr><td style="padding:0 0 12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#FBFCFC;border:1px solid #E7EAEE;border-left:3px solid #128F8B;border-radius:6px;">
        <tr><td style="padding:16px 18px;">
          <div style="font-size:17px;font-weight:bold;color:#222222;">${esc(r.name ?? "—")}</div>
          <div style="font-size:14px;margin:3px 0 12px;">
            <a href="mailto:${esc(r.email)}" style="color:#128F8B;text-decoration:none;">${esc(r.email)}</a>
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${detail.map(([k, v]) => `<tr><td ${label}>${esc(k)}</td><td ${value}>${esc(v)}</td></tr>`).join("")}
            <tr><td ${label}>Signed up</td><td ${value}>${esc(time)}</td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>`;
  };

  const body = rows.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows.map(card).join("")}</table>`
    : `<p style="font-size:15px;color:#5A6570;margin:0;">No Founding 100 sign-ups today.</p>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:Arial,'Segoe UI',sans-serif;background:#F4F6F8;">
  <div style="max-width:560px;margin:0 auto;padding:24px 14px;">
    <div style="background:#ffffff;border-radius:16px;padding:28px 22px;border:1px solid #E7EAEE;">
      <div style="font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.14em;color:#0C7370;">Founding 100</div>
      <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:23px;color:#222222;margin:8px 0 4px;">
        ${rows.length} sign-up${rows.length === 1 ? "" : "s"} today
      </h1>
      <p style="font-size:13px;color:#8A93A0;margin:0 0 22px;">${esc(dayLabel)}</p>
      ${body}
    </div>
    <p style="color:#B6BDC6;font-size:11px;text-align:center;margin:16px 0 0;">Willow &middot; willow-inc.com/founding-100</p>
  </div>
</body></html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel Cron signs its calls with CRON_SECRET. Requiring it keeps the
  // endpoint from being used to spam the inbox from the open internet.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const now = new Date();
  const since = startOfTodayInNewYork(now);

  let rows: Row[];
  try {
    const { data, error } = await adminClient()
      .from("form_submissions")
      .select("name, email, message, created_at")
      .eq("form_type", FOUNDING_100_FORM_TYPE)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    rows = (data ?? []) as Row[];
  } catch (err) {
    console.error("Founding 100 digest query failed:", err);
    return res.status(500).json({ error: "Query failed" });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error("Founding 100 digest: SMTP is not configured; nothing sent.");
    return res.status(500).json({ error: "SMTP not configured", found: rows.length });
  }

  const port = Number(process.env.SMTP_PORT ?? "465");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port,
    // Implicit TLS only on 465; 587/25 use STARTTLS. Mirrors the platform's
    // mail-transport.ts so both read the same SMTP_* variables.
    secure: process.env.SMTP_SECURE != null ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });

  const dayLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE, weekday: "long", month: "long", day: "numeric", year: "numeric",
  }).format(now);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER,
      to: DIGEST_TO,
      subject: `Founding 100 — ${rows.length} sign-up${rows.length === 1 ? "" : "s"} today (${dayLabel})`,
      html: buildHtml(rows, dayLabel),
    });
  } catch (err) {
    console.error("Founding 100 digest send failed:", err);
    return res.status(500).json({ error: "Send failed", found: rows.length });
  }

  return res.status(200).json({ ok: true, sent: rows.length, since: since.toISOString() });
}
