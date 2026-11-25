import React from "react";
import { ChevronDown } from "lucide-react";

// ---- Client "My Estate Plan" screen, recreated from apps/clients ----
export const ClientCard = ({
  icon,
  title,
  subtitle,
  open,
  disabled,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  open?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}) => (
  <div className={`bg-white ${disabled ? "opacity-50 grayscale" : ""}`}>
    <div className={`flex items-center gap-4 p-6 text-left ${disabled ? "cursor-default" : "transition-colors hover:bg-[#F4F5F6]"}`}>
      <img src={icon} alt="" className="h-14 w-14 flex-shrink-0 object-contain" />
      <span className="min-w-0 flex-1">
        <span className="mb-0.5 block font-semibold text-[#1F2933]" style={{ fontSize: 16 }}>{title}</span>
        <span className="block text-[#9CA3AF]" style={{ fontSize: 14 }}>{subtitle}</span>
      </span>
      {!disabled && <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`} />}
    </div>
    {open && <div className="px-6 pb-6 sm:px-8 sm:pb-8">{children}</div>}
  </div>
);

export const ShareBar = ({ name, pct, note }: { name: string; pct: number; note: string }) => (
  <div className="mb-4">
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="font-medium text-[#1F2933]" style={{ fontSize: 14 }}>{name}</span>
      <span className="font-semibold text-[#128F8B]" style={{ fontSize: 14 }}>{pct}%</span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-[#E5E7EB]">
      <div className="h-full rounded-full bg-[#128F8B]" style={{ width: `${pct}%` }} />
    </div>
    <div className="mt-1.5 text-[#9CA3AF]" style={{ fontSize: 13 }}>{note}</div>
  </div>
);

export const ClientEstatePlanScreen = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#FAFBFC] text-left" style={{ fontFamily: "Inter, sans-serif", height: 855 }}>
    {/* Header */}
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="relative mx-auto flex w-full max-w-[1300px] items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <span className="px-4 py-2 text-base font-medium text-[#128F8B] underline decoration-2 underline-offset-4">My Estate Plan</span>
          <span className="flex items-center gap-1 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Shared <ChevronDown className="h-4 w-4" />
          </span>
        </div>
        <img src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" alt="Willow" className="absolute left-1/2 h-10 -translate-x-1/2" />
        <div className="text-right">
          <span className="block text-sm font-semibold text-gray-900">Daniel Rosen</span>
          <span className="block text-xs text-gray-500">daniel.rosen@gmail.com</span>
        </div>
      </div>
    </div>

    {/* Hero band */}
    <div className="border-b border-gray-100 bg-white px-6 pb-7 pt-8 text-center">
      <h3 className="mb-2 text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: 38, fontWeight: 600 }}>
        Your Plan's Playbook
      </h3>
      <p className="mx-auto max-w-[540px] text-[#6B7280]" style={{ fontSize: 17, lineHeight: 1.6 }}>
        We've made it simple for you to understand everything.
      </p>
    </div>

    {/* Card stack */}
    <div className="mx-auto max-w-[900px] px-4 pt-6">
      <div className="space-y-1.5 overflow-hidden rounded-2xl bg-gray-100" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <ClientCard icon="/mock/family-icon.png" title="You & Your Family" subtitle="The people at the center of your plan" />
        <ClientCard icon="/mock/shield-icon.png" title="If You Need Someone to Step In" subtitle="What happens if you can't make decisions for yourself" />
        <ClientCard icon="/mock/tree-icon.png" title="What You'll Leave Behind" subtitle="How your estate is managed and distributed" />
        <ClientCard icon="/mock/docs-icon.png" title="Your Documents" subtitle="Signed documents, recordings, and compliance files" />
      </div>
    </div>

    {/* Ask Eva */}
    <div className="absolute bottom-6 right-6 flex items-center gap-2.5 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-5 shadow-lg hover:shadow-xl">
      <img src="/mock/eva.png" alt="Eva" className="h-10 w-10 rounded-full object-cover" style={{ backgroundColor: "rgba(84,167,154,0.1)" }} />
      <span className="font-medium text-[#1F2933]" style={{ fontSize: 15 }}>Ask Eva</span>
    </div>
  </div>
);
