import React from "react";

export const BackgroundGrid: React.FC = () => (
  <>
    <div
      className="fixed inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, #44403c 1px, transparent 1px),
          linear-gradient(to bottom, #44403c 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
    <div className="fixed top-0 left-0 w-full h-1 bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-scan opacity-20 pointer-events-none z-50" />
  </>
);
