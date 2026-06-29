import React from "react";

export default function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-deep-ochre mb-4">
      <span className="w-8 h-px bg-gold" />
      {children}
    </span>
  );
}