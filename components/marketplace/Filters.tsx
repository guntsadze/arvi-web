import React from "react";

interface FiltersProps {
  filters: any;
  onChange: (key: any, value: any) => void;
}

export const MarketplaceFilters: React.FC<FiltersProps> = ({
  filters,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-stone-900/40 p-6 rounded-xl border border-stone-800/50 mb-8">
      {/* Search Query */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-stone-300 uppercase font-bold ml-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Model, Make or Title..."
          className="bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-stone-200 focus:outline-none focus:border-orange-500/50 transition-colors"
          onChange={(e) => onChange("query", e.target.value)}
        />
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-stone-300 uppercase font-bold ml-1">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm"
            onChange={(e) =>
              onChange("minPrice", Number(e.target.value) || undefined)
            }
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm"
            onChange={(e) =>
              onChange("maxPrice", Number(e.target.value) || undefined)
            }
          />
        </div>
      </div>

      {/* Condition & Sort */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-stone-300 uppercase font-bold ml-1">
          Condition
        </label>
        <select
          className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-300"
          onChange={(e) => onChange("condition", e.target.value)}
        >
          <option value="">All Conditions</option>
          <option value="NEW">New</option>
          <option value="USED">Used</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-stone-300 uppercase font-bold ml-1">
          Sort By
        </label>
        <select
          className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-300 font-medium"
          onChange={(e) => onChange("sortBy", e.target.value)}
          value={filters.sortBy}
        >
          <option value="newest">Latest First</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
};
