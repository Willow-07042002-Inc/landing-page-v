import React from "react";
import { Navigate, useLocation } from "react-router-dom";
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
import { RecipientPortalVignette } from "@/components/site/vignettes";
import { CARDS, pageByPath } from "@/content/pages";

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

const CLIENT_SIDE = ["/solutions/wills", "/solutions/trusts", "/solutions/powers-of-attorney", "/solutions/guardianship"];

const TemplatePage = () => {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "");
  const def = pageByPath(path);
  usePageMeta(def?.metaTitle ?? "Willow", def?.metaDesc ?? "");
  if (!def) return <Navigate to="/" replace />;

  const related = def.related.filter((p) => CARDS[p]).map((p) => ({ ...CARDS[p], to: p }));
  const heroAspect = def.hero.aspect ?? "900 / 560";
  const pts = split(def.pointsTitle);
  const rows = split(def.rowsTitle);
  const steps = split(def.steps?.title);

  return (
    <PageShell quotes>
      <PageHero
        eyebrow={def.eyebrow}
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
        <LinkCards
          eyebrow={related.length > 3 ? "The platform" : "Related"}
          title={related.length > 3 ? "Explore the platform," : "Keep exploring."}
          accent={related.length > 3 ? "page by page." : undefined}
          cards={related}
        />
      )}
      <ClosingCta title={def.closing?.title} body={def.closing?.body} shot={CLIENT_SIDE.includes(path) ? <RecipientPortalVignette state="released" /> : undefined} />
    </PageShell>
  );
};

export default TemplatePage;
