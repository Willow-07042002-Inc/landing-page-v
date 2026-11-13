import React from "react";
import { Link } from "react-router-dom";
import { H2, P, UL, LI, B } from "@/components/LegalPage";

/* Renders the legal documents straight from the drafter's Markdown
   (src/content/legal/*.md), so publishing a new version is a file swap and
   the website text is word for word the signed text.

   Handles exactly what those files use: "#" and "##" headings, paragraphs,
   "- " lists, "> " summary boxes, pipe tables, **bold**, *italic*,
   [links](url) and backslash escapes. Email addresses and willow-inc.com
   paths become links. Numbered clauses ("5.4 ...") get an id ("s5-4") so
   they can be linked to directly. */

const LINK = "font-semibold text-[#128F8B] hover:text-[#0C7370] underline underline-offset-2";

/** willow-inc.com/<path> → an in-site link; other http(s) → a new tab. */
const SitePath = /^(?:https?:\/\/)?(?:www\.)?willow-inc\.com(\/[\w/#-]*)?$/;

function renderLink(href: string, children: React.ReactNode, key: React.Key) {
  const site = href.match(SitePath);
  if (site) {
    return (
      <Link key={key} to={site[1] || "/"} className={LINK}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a key={key} href={href} className={LINK}>
        {children}
      </a>
    );
  }
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {children}
    </a>
  );
}

// Order matters: explicit links and emphasis first, then bare emails/site paths.
const INLINE =
  /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|\*([^*\s][^*]*?)\*|([\w.+-]+@willow-inc\.com)|((?:https?:\/\/)?(?:www\.)?willow-inc\.com\/[\w/-]*[\w/])/g;

export function inline(text: string, keyBase = "i"): React.ReactNode[] {
  // Backslash escapes (\[, \], \*) are plain characters.
  const src = text.replace(/\\([[\]*_\\])/g, (_, c) => `\u0000${c.charCodeAt(0)}\u0000`);
  const unescape = (s: string) => s.replace(/\u0000(\d+)\u0000/g, (_, n) => String.fromCharCode(Number(n)));
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of src.matchAll(INLINE)) {
    if (m.index! > last) out.push(unescape(src.slice(last, m.index)));
    const key = `${keyBase}-${k++}`;
    if (m[1] !== undefined) out.push(renderLink(unescape(m[2]), inline(unescape(m[1]), key), key));
    else if (m[3] !== undefined) out.push(<B key={key}>{inline(unescape(m[3]), key)}</B>);
    else if (m[4] !== undefined) out.push(<em key={key}>{inline(unescape(m[4]), key)}</em>);
    else if (m[5] !== undefined) out.push(renderLink(`mailto:${m[5]}`, m[5], key));
    else if (m[6] !== undefined) out.push(renderLink(m[6], m[6], key));
    last = m.index! + m[0].length;
  }
  if (last < src.length) out.push(unescape(src.slice(last)));
  return out;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\*|\\/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "## 5. How We Share" → "s5"; other headings → a slug of their text. */
function headingId(text: string, prefix: string) {
  const n = text.match(/^(\d+)\.\s/);
  return prefix + (n ? `s${n[1]}` : slugify(text));
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim());

type Block =
  | { kind: "h1" | "h2" | "p"; text: string }
  | { kind: "quote"; lines: string[] }
  | { kind: "list"; items: string[] }
  | { kind: "table"; rows: string[][] };

export function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ kind: "h1", text: line.slice(2).trim() });
      i++;
    } else if (/^#{2,6} /.test(line)) {
      blocks.push({ kind: "h2", text: line.replace(/^#+ /, "").trim() });
      i++;
    } else if (line.startsWith(">")) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) q.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ kind: "quote", lines: q.filter((l) => l.trim()) });
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) items.push(lines[i++].slice(2));
      blocks.push({ kind: "list", items });
    } else if (line.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const r = lines[i++];
        if (!/^\s*\|?\s*:?-{3,}/.test(r)) rows.push(cells(r));
      }
      blocks.push({ kind: "table", rows });
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#|>|- |\s*\|)/.test(lines[i])) para.push(lines[i++]);
      blocks.push({ kind: "p", text: para.join(" ") });
    }
  }
  return blocks;
}

/** Title (the first "# " heading) and the "Version of …" line, if present. */
export function docMeta(md: string): { title: string; version: string | null } {
  const title = md.match(/^# (.+)$/m)?.[1].trim() ?? "";
  const version = md.match(/^Version of (.+)$/m)?.[1].trim() ?? null;
  return { title, version };
}

const Summary = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6 rounded-md border-l-4 border-[#128F8B] bg-[#F1F8F8] px-5 py-4 text-[15px] leading-relaxed text-gray-700">
    {children}
  </div>
);

const Table = ({ rows, k }: { rows: string[][]; k: string }) => {
  const [head, ...body] = rows;
  const hasHead = head.some((c) => c);
  return (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: 520 }}>
        {hasHead && (
          <thead>
            <tr>
              {head.map((h, j) => (
                <th key={j} className="border-b-2 border-[#222222] p-3 text-left align-bottom text-[15px] font-semibold text-[#222222]">
                  {inline(h, `${k}-h${j}`)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {(hasHead ? body : rows).map((r, ri) => (
            <tr key={ri}>
              {r.map((c, j) => (
                <td key={j} className="border-b border-gray-200 p-3 align-top text-[15px] leading-relaxed">
                  {inline(c, `${k}-${ri}-${j}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * The body of a document. `skipHeader` drops the leading "# Title" and
 * "Version of …" lines (the page shell shows them). `idPrefix` keeps ids
 * unique when two documents share a page (the Agreement and its DPA).
 * `fill` replaces exact placeholder strings at render time, without touching
 * the source file.
 */
export const LegalMarkdown = ({
  source,
  skipHeader = true,
  idPrefix = "",
  fill = {},
}: {
  source: string;
  skipHeader?: boolean;
  idPrefix?: string;
  fill?: Record<string, string>;
}) => {
  let md = source;
  for (const [from, to] of Object.entries(fill)) md = md.split(from).join(to);
  let blocks = parse(md);
  if (skipHeader) {
    if (blocks[0]?.kind === "h1") blocks = blocks.slice(1);
    if (blocks[0]?.kind === "p" && /^Version of /.test(blocks[0].text)) blocks = blocks.slice(1);
  }
  return (
    <>
      {blocks.map((b, n) => {
        const k = `${idPrefix}b${n}`;
        switch (b.kind) {
          case "h1":
            return (
              <h2 key={k} id={idPrefix ? idPrefix.replace(/-$/, "") : slugify(b.text)} className="mt-16 mb-4 scroll-mt-28 text-3xl font-heading font-light text-[#222222]">
                {inline(b.text, k)}
              </h2>
            );
          case "h2":
            return (
              <H2 key={k} id={headingId(b.text, idPrefix)}>
                {inline(b.text, k)}
              </H2>
            );
          case "quote":
            return (
              <Summary key={k}>
                {b.lines.map((l, j) => (
                  <p key={j} className={j ? "mt-2" : ""}>
                    {inline(l, `${k}-${j}`)}
                  </p>
                ))}
              </Summary>
            );
          case "list":
            return (
              <UL key={k}>
                {b.items.map((it, j) => (
                  <LI key={j}>{inline(it, `${k}-${j}`)}</LI>
                ))}
              </UL>
            );
          case "table":
            return <Table key={k} rows={b.rows} k={k} />;
          default: {
            const clause = b.text.match(/^(\d+(?:\.\d+)+)\s/);
            return clause ? (
              <p key={k} id={`${idPrefix}s${clause[1].replace(/\./g, "-")}`} className="mb-5 scroll-mt-28 text-base leading-relaxed">
                {inline(b.text, k)}
              </p>
            ) : (
              <P key={k}>{inline(b.text, k)}</P>
            );
          }
        }
      })}
    </>
  );
};
