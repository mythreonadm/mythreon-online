import React from "react";

export type AccessIconName = "explore" | "character" | "backpack" | "depot" | "matrix" | "shop" | "quest" | "duel" | "archive";

interface AccessIconProps {
  name: AccessIconName;
  className?: string;
}

export function AccessIcon({ name, className = "" }: AccessIconProps) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    focusable: false,
  };

  switch (name) {
    case "explore":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="m15.7 8.3-2.4 5-5 2.4 2.4-5 5-2.4Z" /></svg>;
    case "character":
      return <svg {...common}><circle cx="12" cy="8" r="3.3" /><path d="M5 20c.6-3.6 3-5.5 7-5.5s6.4 1.9 7 5.5" /></svg>;
    case "backpack":
      return <svg {...common}><path d="M8 7V5.5a4 4 0 0 1 8 0V7" /><rect x="5" y="7" width="14" height="14" rx="2.5" /><path d="M9 11h6M9 15h6M9 7v2M15 7v2" /></svg>;
    case "depot":
      return <svg {...common}><path d="m3 9 2-5h14l2 5" /><path d="M4 9v11h16V9M3 9h18M12 9v11M8 13h1M15 13h1" /></svg>;
    case "matrix":
      return <svg {...common}><path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z" /><path d="M12 2v20M4 6.5l16 11M20 6.5l-16 11" /></svg>;
    case "shop":
      return <svg {...common}><path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /><path d="M9 20v-6h6v6" /></svg>;
    case "quest":
      return <svg {...common}><path d="M6 4h11a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h11" /><path d="M6 4v12M18 10v10M10 7h4M10 13h4M10 19h4" /><circle cx="18" cy="7" r="3" /></svg>;
    case "duel":
      return <svg {...common}><path d="m5 4 2-2 5 5-2 2M19 4l-2-2-5 5 2 2M8 8l8 8M16 8l-8 8M4 20l4-4M20 20l-4-4" /></svg>;
    case "archive":
      return <svg {...common}><path d="M3 5.5 11 4v16l-8 1V5.5ZM21 5.5 13 4v16l8 1V5.5ZM5.5 8l3.5-.5M15 7.5l3.5.5" /></svg>;
  }
}
