import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Shared scaffolding for the legal pages (/terms, /privacy) — matches the
   marketing pages: FCFCFD ground, teal eyebrow, light serif title, hairline
   divider, grey prose at a readable measure. */

/** No helmet lib in this repo — set title/description directly. */
export const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
    window.scrollTo(0, 0);
  }, [title, description]);
};

export const LegalShell = ({
  eyebrow,
  title,
  date,
  toc,
  children,
}: {
  eyebrow: string;
  title: string;
  date: string;
  toc?: { id: string; label: string }[];
  children: React.ReactNode;
}) => (
  <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
    <Navbar />
    <main className="flex-grow pt-32 md:pt-36 pb-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">{eyebrow}</div>
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-heading font-light text-center mb-4 text-[#222222]" style={{ lineHeight: 1.25 }}>
            {title}
          </h1>
          <div className="text-center text-[13px] font-medium uppercase tracking-[0.1em] text-gray-400">Last updated: {date}</div>

          <div className="mx-auto my-10 w-12 border-t border-gray-300" />

          <div className="text-gray-600">{children}</div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="mt-12 mb-4 scroll-mt-28 text-2xl font-heading font-semibold text-[#222222]">
    {children}
  </h2>
);

export const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-5 text-base leading-relaxed">{children}</p>
);

export const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>
);

export const LI = ({ children }: { children: React.ReactNode }) => <li className="text-base leading-relaxed">{children}</li>;

export const B = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-[#222222]">{children}</strong>
);

/** Hairline table that scrolls sideways on small screens instead of breaking. */
export const LegalTable = ({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) => (
  <div className="mb-6 overflow-x-auto">
    <table className="w-full border-collapse" style={{ minWidth: 520 }}>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} className="border-b-2 border-[#222222] p-3 text-left text-[15px] font-semibold text-[#222222]">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, i) => (
          <tr key={i}>
            {cells.map((c, j) => (
              <td key={j} className="border-b border-gray-200 p-3 align-top text-[15px] leading-relaxed">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
