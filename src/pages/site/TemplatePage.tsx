import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  PageShell,
  PageHero,
  PrintFrame,
  ValuePoints,
  FeatureRows,
  Steps,
  Faq,
  LinkCards,
  SecurityBand,
  ClosingCta,
  Statement,
  usePageMeta,
} from "@/components/site/blocks";
import { CARDS, pageByPath } from "@/content/pages";
import { ScaledScreen } from "@/components/product/kit";
import { AttorneyDashboardScreen } from "@/components/product/attorney-dashboard";
import { ClientEstatePlanTodayScreen } from "@/components/product/client-app";

/* Renders any platform or solutions page from its definition in
   src/content/pages.tsx, in the homepage's order and clothes: the hero and
   the product, three points, how it works, the product in depth, a
   statement, FAQ, security, related pages, the dark closing card, quotes. */

/* Section titles take their second phrase in teal, the way the For Clients
   page sets "Countless pages, / one simple summary." */
const split = (t?: string): { title?: string; accent?: string } => {
  if (!t) return {};
  const dot = t.indexOf(". ");
  if (dot > 0) return { title: t.slice(0, dot + 1), accent: t.slice(dot + 2) };
  const comma = t.indexOf(", ");
  if (comma > 0) return { title: t.slice(0, comma + 1), accent: t.slice(comma + 2) };
  return { title: t };
};

/* Which side of the Platform menu a page sits on. The eyebrow names it and
   links back to that side's overview (the same place the homepage card and
   the menu heading go), and the related cards are that side's pages. */
const CLIENT_SIDE = ["/platform/sharing", "/solutions/their-team"];
const sideOf = (path: string) =>
  CLIENT_SIDE.includes(path)
    ? { label: "For clients & their team", to: "/for-clients", more: "More for clients & their team." }
    : { label: "For attorneys", to: "/platform", more: "More for attorneys." };

const TemplatePage = () => {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "");
  const def = pageByPath(path);
  usePageMeta(def?.metaTitle ?? "Willow", def?.metaDesc ?? "");
  if (!def) return <Navigate to="/" replace />;

  const side = sideOf(path);
  const related = def.related.filter((p) => CARDS[p]).map((p) => ({ ...CARDS[p], to: p }));
  const heroAspect = def.hero.aspect ?? "900 / 560";
  const pts = split(def.pointsTitle);
  const rows = split(def.rowsTitle);
  const steps = split(def.steps?.title);

  return (
    <PageShell quotes>
      <PageHero
        eyebrow={
          path === side.to ? (
            side.label
          ) : (
            <>
              <Link to={side.to} className="underline-offset-4 hover:underline">
                {side.label}
              </Link>
              <span className="mx-2 text-[#0C7370]/50">·</span>
              {def.eyebrow}
            </>
          )
        }
        title={def.title}
        accent={def.accent}
        subtitle={def.subtitle}
        secondary={def.secondary}
        visualAspect={heroAspect}
        visual={
          <PrintFrame print={def.hero.print} aspect={heroAspect} className="shadow-2xl">
            {def.hero.visual}
          </PrintFrame>
        }
      />
      <ValuePoints title={pts.title} accent={pts.accent} points={def.points} />
      {def.steps && <Steps eyebrow={def.steps.eyebrow} title={steps.title!} accent={steps.accent} steps={def.steps.steps} />}
      {def.rows && <FeatureRows eyebrow={def.rowsEyebrow} title={rows.title} accent={rows.accent} lead={def.rowsLead} rows={def.rows} />}
      {def.statement && <Statement by={def.statement.by}>{def.statement.text}</Statement>}
      {def.faq && <Faq items={def.faq} />}
      {def.security && <SecurityBand />}
      {related.length > 0 && (
        <LinkCards eyebrow={side.label} title={path === side.to ? "Everything here," : side.more} accent={path === side.to ? "page by page." : undefined} cards={related} />
      )}
      <ClosingCta
        title={def.closing?.title}
        body={def.closing?.body}
        shot={<ScaledScreen>{side.to === "/for-clients" ? <ClientEstatePlanTodayScreen /> : <AttorneyDashboardScreen />}</ScaledScreen>}
      />
    </PageShell>
  );
};

export default TemplatePage;
