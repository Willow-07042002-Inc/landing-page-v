import React, { useLayoutEffect, useRef, useState } from "react";
import { STATE_PATHS } from "@/lib/usStates";

/* One state's silhouette, cropped to its own bounds. The map's paths live in
   one big 959×593 coordinate space, so we measure the rendered path once and
   frame the viewBox around it. Fill follows currentColor. */
const StateShape = ({ code, className }: { code: string; className?: string }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [viewBox, setViewBox] = useState("0 0 959 593");
  useLayoutEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    try {
      const b = el.getBBox();
      const pad = Math.max(b.width, b.height) * 0.04;
      setViewBox(`${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`);
    } catch {
      /* detached render — keep the full-map viewBox */
    }
  }, [code]);
  return (
    <svg viewBox={viewBox} className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      <path ref={pathRef} d={STATE_PATHS[code]} fill="currentColor" />
    </svg>
  );
};

export default StateShape;
