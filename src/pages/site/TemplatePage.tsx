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
import { CARDS, pageByPath } from "@/content/pages";

/* Renders any platform or solutions page from its definition in
   src/content/pages.tsx. Section order is fixed so every page reads the same
   way: hero and product, three points, how it works, the product in depth, a
   statement, FAQ, security, related pages, closing call to action. */

const TemplatePage = () => {
  const { pathname } = useLocation();
  const def = pageByPath(pathname.replace(/\/$/, ""));
  usePageMeta(def?.metaTitle ?? "Willow", def?.metaDesc ?? "");
  if (!def) return <Navigate to="/" replace />;

  const related = def.related.filter((p) => CARDS[p]).map((p) => ({ ...CARDS[p], to: p }));

  return (
    <PageShell>
      <PageHero
        eyebrow={def.eyebrow}
        title={def.title}
        subtitle={def.subtitle}
        secondary={def.secondary}
        visual={
          <PrintFrame print={def.hero.print} aspect={def.hero.aspect} width={def.hero.width ?? "86%"} frameAspect={def.hero.frameAspect ?? "16 / 9"}>
            {def.hero.visual}
          </PrintFrame>
        }
      />
      <ValuePoints title={def.pointsTitle} points={def.points} />
      {def.steps && <Steps eyebrow={def.steps.eyebrow} title={def.steps.title} steps={def.steps.steps} />}
      {def.rows && <FeatureRows eyebrow={def.rowsEyebrow} title={def.rowsTitle} lead={def.rowsLead} rows={def.rows} />}
      {def.statement && <Statement by={def.statement.by}>{def.statement.text}</Statement>}
      {def.faq && <Faq items={def.faq} />}
      {def.security && <SecurityBand />}
      {related.length > 0 && (
        <LinkCards eyebrow="Keep exploring" title={related.length > 3 ? "Explore the platform" : "Related"} cards={related} cols={3} />
      )}
      <ClosingCta title={def.closing?.title} body={def.closing?.body} />
    </PageShell>
  );
};

export default TemplatePage;
