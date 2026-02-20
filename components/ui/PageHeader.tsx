import React from "react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {onBack && (
        <button
          onClick={onBack}
          className="text-stone-400 hover:text-stone-200 transition-colors duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </button>
      )}
      <h1
        className={`text-4xl font-bold text-stone-100 ${!onBack ? "w-full text-center" : ""}`}
      >
        {title}
      </h1>
      {onBack && <div className="w-6 h-6"></div>} {/* Spacer for alignment */}
    </div>
  );
};
