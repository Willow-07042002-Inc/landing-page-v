/* The kit every recreated product screen is built from: the canvas that
   scales a full-size screen to fit, the product's own icons, the attorney
   app's sidebar and top bar, and its card styles. Everything here is copied
   from apps/professionals and packages/ui (origin/main, Nov 17 2026). */
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Renders a full-size product screen (1440×855 by default; pass `w` for a
 * wider canvas) scaled to fit its parent. Building at real app dimensions lets
 * the markup reuse the exact spacing and type sizes from the product code.
 */
export const ScaledScreen = ({ children, w = 1440, h = 855 }: { children: React.ReactNode; w?: number; h?: number }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const measure = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 50) setScale(width / w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={outerRef} className="absolute inset-0 overflow-hidden">
      {/* antialiased, as the product's own <body> is: without it macOS draws
          light-on-dark text (the W mark, white buttons) visibly heavier */}
      <div className="antialiased" style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
};

// Tints the real product SVG icons (which rely on currentColor) via CSS mask
export const MaskIcon = ({ src, color, size = 18 }: { src: string; color: string; size?: number }) => (
  <span
    aria-hidden
    style={{
      display: "inline-block",
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMask: `url(${src}) center / contain no-repeat`,
      mask: `url(${src}) center / contain no-repeat`,
    }}
  />
);

/* dashboard-content.tsx CARD_SHADOW */
export const PRO_CARD_SHADOW =
  "0 2px 4px rgba(16,24,40,0.05), 0 18px 36px -12px rgba(16,24,40,0.20), 0 40px 72px -24px rgba(16,24,40,0.18)";

/* NotificationIcon / RemindersIcon, verbatim from packages/ui */
export const ProBellIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12 2.5a1.35 1.35 0 0 0-1.35 1.35v.63C8.05 5.12 6.35 7.32 6.35 9.97c0 3.03-.78 4.63-1.55 5.6-.53.66-.03 1.68.82 1.68h12.76c.85 0 1.35-1.02.82-1.68-.77-.97-1.55-2.57-1.55-5.6 0-2.65-1.7-4.85-4.3-5.49v-.63A1.35 1.35 0 0 0 12 2.5Z" />
    <path d="M9.9 18.7a2.1 2.1 0 0 0 4.2 0Z" />
  </svg>
);

/* sidebar.tsx: the W mark, then Dashboard and Clients (Signings is hidden today) */
export const ProSidebar = ({ active }: { active: "dashboard" | "clients" | "settings" }) => (
  <div className="relative z-30 flex w-[68px] flex-shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
    <div className="flex h-16 items-center px-[14px]">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#309E96] text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 20, lineHeight: 1, paddingTop: 2 }}>
        W
      </span>
    </div>
    <div className="mx-3 border-t border-[#E5E7EB]" />
    <div className="flex flex-col gap-0.5 px-2 pt-6">
      <span className="flex items-center justify-center rounded-lg px-3 py-2">
        <MaskIcon src="/mock/dashboard-icon.svg" color={active === "dashboard" ? "#309E96" : "#9CA3AF"} />
      </span>
      <span className="flex items-center justify-center rounded-lg px-3 py-2">
        <MaskIcon src="/mock/clients-icon.svg" color={active === "clients" ? "#309E96" : "#9CA3AF"} />
      </span>
    </div>
  </div>
);

/* top-bar.tsx: the bell with its unread count, then the attorney and firm */
export const ProTopBar = () => (
  <div className="relative z-30 flex h-16 flex-shrink-0 items-center border-b border-[#E5E7EB] bg-white px-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
    <div className="ml-auto flex items-center gap-1">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#6B7280]">
        <ProBellIcon className="h-5 w-5" />
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#309E96] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">3</span>
      </span>
      <span className="flex items-center gap-3 rounded-lg px-2.5 py-2">
        <span className="text-right">
          <span className="block text-[13px] font-semibold leading-tight text-[#1F2933]">Rachel Alvarez</span>
          <span className="mt-0.5 block text-[11px] leading-tight text-[#9CA3AF]">Alvarez Family Law</span>
        </span>
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F9F9] text-[11px] font-bold text-[#309E96] ring-1 ring-black/5">RA</span>
        <WIcon name="chevronDown" className="h-3.5 w-3.5 text-[#9CA3AF]" />
      </span>
    </div>
  </div>
);


/* The grey initials every dashboard row starts with (teal on hover) */
export const ProInitials = ({ name }: { name: string }) => (
  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#9CA3AF] ring-1 ring-black/5 transition-colors group-hover:bg-[#F0F9F9] group-hover:text-[#309E96]">
    <span className="text-[13px] font-semibold">{name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
  </span>
);


/* The product's own icons, verbatim from packages/ui/icons/willow-solid */
export const WILLOW_ICON_PATHS = {
  search:
    "M17.74 8.43 17.42 7.49 16.98 6.6 16.43 5.77 15.77 5.03 15.03 4.37 14.2 3.82 13.31 3.38 12.37 3.06 11.39 2.87 10.4 2.8 9.41 2.87 8.43 3.06 7.49 3.38 6.6 3.82 5.77 4.37 5.03 5.03 4.37 5.77 3.82 6.6 3.38 7.49 3.06 8.43 2.87 9.41 2.8 10.4 2.87 11.39 3.06 12.37 3.38 13.31 3.82 14.2 4.37 15.03 5.03 15.77 5.77 16.43 6.6 16.98 7.49 17.42 8.43 17.74 9.41 17.93 10.4 18 11.39 17.93 12.37 17.74 13.31 17.42 14.2 16.98 14.51 16.77 19.43 21.67 19.6 21.79 19.99 21.95 20.4 22 20.81 21.95 21.2 21.79 21.53 21.53 21.79 21.2 21.88 21.01 21.99 20.61 21.99 20.19 21.95 19.99 21.79 19.6 21.53 19.27 16.77 14.51 16.98 14.2 17.42 13.31 17.74 12.37 17.93 11.39 18 10.4 17.93 9.41ZM15.13 11.67 14.93 12.28 14.64 12.85 14.29 13.38 13.86 13.86 13.38 14.29 12.85 14.64 12.28 14.93 11.67 15.13 11.04 15.26 10.4 15.3 9.76 15.26 9.13 15.13 8.52 14.93 7.95 14.64 7.42 14.29 6.94 13.86 6.51 13.38 6.16 12.85 5.87 12.28 5.67 11.67 5.54 11.04 5.5 10.4 5.54 9.76 5.67 9.13 5.87 8.52 6.16 7.95 6.51 7.42 6.94 6.94 7.42 6.51 7.95 6.16 8.52 5.87 9.13 5.67 9.76 5.54 10.4 5.5 11.04 5.54 11.67 5.67 12.28 5.87 12.85 6.16 13.38 6.51 13.86 6.94 14.29 7.42 14.64 7.95 14.93 8.52 15.13 9.13 15.26 9.76 15.3 10.4 15.26 11.04Z",
  more:
    "M20.93 11.48 20.85 11.23 20.73 11 20.59 10.78 20.41 10.59 20.22 10.41 20 10.27 19.77 10.15 19.52 10.07 19.26 10.02 19 10 18.74 10.02 18.48 10.07 18.23 10.15 18 10.27 17.78 10.41 17.59 10.59 17.41 10.78 17.27 11 17.15 11.23 17.07 11.48 17.02 11.74 17 12 17.02 12.26 17.07 12.52 17.15 12.77 17.27 13 17.41 13.22 17.59 13.41 17.78 13.59 18 13.73 18.23 13.85 18.48 13.93 18.74 13.98 19 14 19.26 13.98 19.52 13.93 19.77 13.85 20 13.73 20.22 13.59 20.41 13.41 20.59 13.22 20.73 13 20.85 12.77 20.93 12.52 20.98 12.26 21 12 20.98 11.74ZM13.93 11.48 13.85 11.23 13.73 11 13.59 10.78 13.41 10.59 13.22 10.41 13 10.27 12.77 10.15 12.52 10.07 12.26 10.02 12 10 11.74 10.02 11.48 10.07 11.23 10.15 11 10.27 10.78 10.41 10.59 10.59 10.41 10.78 10.27 11 10.15 11.23 10.07 11.48 10.02 11.74 10 12 10.02 12.26 10.07 12.52 10.15 12.77 10.27 13 10.41 13.22 10.59 13.41 10.78 13.59 11 13.73 11.23 13.85 11.48 13.93 11.74 13.98 12 14 12.26 13.98 12.52 13.93 12.77 13.85 13 13.73 13.22 13.59 13.41 13.41 13.59 13.22 13.73 13 13.85 12.77 13.93 12.52 13.98 12.26 14 12 13.98 11.74ZM6.98 11.74 6.93 11.48 6.85 11.23 6.73 11 6.59 10.78 6.41 10.59 6.22 10.41 6 10.27 5.77 10.15 5.52 10.07 5.26 10.02 5 10 4.74 10.02 4.48 10.07 4.23 10.15 4 10.27 3.78 10.41 3.59 10.59 3.41 10.78 3.27 11 3.15 11.23 3.07 11.48 3.02 11.74 3 12 3.02 12.26 3.07 12.52 3.15 12.77 3.27 13 3.41 13.22 3.59 13.41 3.78 13.59 4 13.73 4.23 13.85 4.48 13.93 4.74 13.98 5 14 5.26 13.98 5.52 13.93 5.77 13.85 6 13.73 6.22 13.59 6.41 13.41 6.59 13.22 6.73 13 6.85 12.77 6.93 12.52 6.98 12.26 7 12Z",
  chevronDown:
    "M11.15 15.85 11.4 16.04 11.54 16.11 11.69 16.16 12 16.2 12.31 16.16 12.46 16.11 12.6 16.04 12.85 15.85 18.95 9.73 19.04 9.6 19.16 9.31 19.2 9 19.16 8.69 19.11 8.54 19.04 8.4 18.85 8.15 18.6 7.96 18.31 7.84 18.16 7.81 17.84 7.81 17.69 7.84 17.4 7.96 17.27 8.05 12 13.3 6.73 8.05 6.46 7.89 6.31 7.84 6.16 7.81 5.84 7.81 5.54 7.89 5.27 8.05 5.15 8.15 4.96 8.4 4.84 8.69 4.81 8.84 4.81 9.16 4.84 9.31 4.89 9.46 5.05 9.73Z",
  chevronRight:
    "M15.85 12.85 16.04 12.6 16.11 12.46 16.16 12.31 16.2 12 16.16 11.69 16.11 11.54 16.04 11.4 15.85 11.15 9.73 5.05 9.6 4.96 9.31 4.84 9 4.8 8.69 4.84 8.54 4.89 8.4 4.96 8.15 5.15 7.96 5.4 7.84 5.69 7.81 5.84 7.81 6.16 7.84 6.31 7.96 6.6 8.05 6.73 13.3 12 8.05 17.27 7.96 17.4 7.84 17.69 7.81 17.84 7.81 18.16 7.84 18.31 7.96 18.6 8.15 18.85 8.4 19.04 8.69 19.16 8.84 19.19 9.16 19.19 9.31 19.16 9.46 19.11 9.73 18.95Z",
  arrowRight:
    "M3.4 10.8 3.24 10.81 2.94 10.89 2.67 11.05 2.45 11.27 2.36 11.4 2.24 11.69 2.21 11.84 2.21 12.16 2.24 12.31 2.36 12.6 2.45 12.73 2.67 12.95 2.94 13.11 3.09 13.16 3.4 13.2 14.6 13.2 14.6 15.29 14.62 15.47 14.69 15.64 14.8 15.78 14.95 15.9 15.21 15.98 15.48 15.97 15.72 15.85 20.06 12.56 20.25 12.35 20.34 12.09 20.34 11.91 20.29 11.73 20.19 11.57 20.06 11.44 15.72 8.15 15.56 8.06 15.39 8.01 15.12 8.03 14.87 8.15 14.74 8.28 14.62 8.53 14.6 8.71 14.6 10.8Z",
  document:
    "M7 2.5h6.5L18.6 7.6V19.4A2.1 2.1 0 0 1 16.5 21.5H7A2.1 2.1 0 0 1 4.9 19.4V4.6A2.1 2.1 0 0 1 7 2.5Zm6.6 1.1V6.8A1.1 1.1 0 0 0 14.7 7.9H17.9zM8.3 11.2A0.7 0.7 0 0 0 8.3 12.6H15.2A0.7 0.7 0 0 0 15.2 11.2Zm0 3A0.7 0.7 0 0 0 8.3 15.6H15.2A0.7 0.7 0 0 0 15.2 14.2Zm0 3A0.7 0.7 0 0 0 8.3 18.6H12.6A0.7 0.7 0 0 0 12.6 17.2Z",
} as const;

export const WIcon = ({ name, className }: { name: keyof typeof WILLOW_ICON_PATHS; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d={WILLOW_ICON_PATHS[name]} />
  </svg>
);

/* globals.css .float-stack: the group floats as one card; only its outer
   corners round, and each section keeps a whisper of shadow at the seams */
export const FLOAT_STACK_SHADOW = "0 1px 2px rgba(16,24,40,0.04), 0 8px 18px -8px rgba(16,24,40,0.12), 0 18px 34px -18px rgba(16,24,40,0.10)";
export const FLOAT_SEAM_SHADOW = "0 2px 8px -4px rgba(16,24,40,0.06)";
export const FloatStack = ({ children }: { children: React.ReactNode }) => {
  const items = React.Children.toArray(children);
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl" style={{ boxShadow: FLOAT_STACK_SHADOW }}>
      {items.map((child, i) => (
        <div
          key={i}
          className={`overflow-hidden bg-white ${i === 0 ? "rounded-t-2xl" : ""} ${i === items.length - 1 ? "rounded-b-2xl" : ""}`}
          style={{ boxShadow: FLOAT_SEAM_SHADOW }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};


export const initialsOf = (name: string) =>
  name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();


