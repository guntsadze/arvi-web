"use client";

import React, { useState, useCallback } from "react";
import { marketplaceService } from "@/services/marketplace.service";
import { Listing } from "@/services/search.service";
import Link from "next/link";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Tag,
  Calendar,
  ArrowUpDown,
  X,
} from "lucide-react";

const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  return (
    <Link href={`/listings/${listing.id}`} className="group">
      <div className="relative bg-stone-900/40 border border-stone-800/50 rounded-xl overflow-hidden hover:border-stone-600 transition-all duration-300 flex flex-col h-full">
        {listing.car.photos && listing.car.photos.length > 0 ? (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={listing.car.photos[0].url}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-stone-800 flex items-center justify-center">
            <Tag className="text-stone-600" size={40} />
          </div>
        )}

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-stone-100 truncate flex-1">
              {listing.title}
            </h3>
          </div>

          <div className="mt-auto space-y-2">
            <p className="text-orange-500 font-bold text-xl">
              {listing.price.toLocaleString()} {listing.currency}
            </p>

            <div className="flex items-center gap-3 text-sm text-stone-400">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-stone-500" />
                {listing.location || "N/A"}
              </span>
              {listing.year && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-stone-500" />
                  {listing.year}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const MarketplacePage: React.FC = () => {
  const [filters, setFilters] = useState({
    query: "",
    sortBy: "newest",
    condition: "",
  });

  const debouncedFilters = useDebounce(filters, 500);
  console.log("🚀 ~ MarketplacePage ~ debouncedFilters:", debouncedFilters);

  const {
    data: listings,
    loading,
    refresh,
  } = useInfiniteScroll(
    (page) => marketplaceService.searchListings(page, debouncedFilters),
    [debouncedFilters],
  );
  console.log("🚀 ~ MarketplacePage ~ listings:", listings);

  const handleFilterChange = (key: any, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({ query: "", sortBy: "newest", condition: "" });
  };

  return (
    <div className="relative min-h-screen bg-[#1c1917] text-stone-100">
      <BackgroundGrid />

      <div className="relative z-10 max-w-7xl mx-auto py-10 px-4">
        <PageHeader title="Marketplace" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-5 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by make, model or title..."
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              className="w-full bg-stone-900/60 border border-stone-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all"
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              onChange={(e) =>
                handleFilterChange("minPrice", Number(e.target.value))
              }
              className="w-1/2 bg-stone-900/60 border border-stone-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-stone-600"
            />
            <input
              type="number"
              placeholder="Max Price"
              onChange={(e) =>
                handleFilterChange("maxPrice", Number(e.target.value))
              }
              className="w-1/2 bg-stone-900/60 border border-stone-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-stone-600"
            />
          </div>

          <div className="md:col-span-2 relative">
            <ArrowUpDown
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
              size={16}
            />
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full bg-stone-900/60 border border-stone-800 rounded-xl py-3 pl-10 pr-4 text-sm appearance-none outline-none focus:border-stone-600"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="md:col-span-2 flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl py-3 px-4 transition-colors"
          >
            <X size={16} />
            Clear
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}

          {/* Empty State */}
          {listings.length === 0 && !loading && (
            <div className="col-span-full py-20 flex flex-col items-center bg-stone-900/20 border border-dashed border-stone-800 rounded-3xl">
              <SlidersHorizontal size={48} className="text-stone-700 mb-4" />
              <h3 className="text-xl font-medium text-stone-400">
                No results found
              </h3>
              <p className="text-stone-600">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
