"use client";

import React, { useState, useCallback } from "react";
import { marketplaceService } from "@/services/marketplace.service";
import { Listing } from "@/services/search.service";
import Link from "next/link";
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
import Image from "next/image";

const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  return (
    <Link href={`/listings/${listing.id}`} className="group">
      <div className="relative bg-surface-1/40 border border-border/50 rounded-xl overflow-hidden hover:border-border transition-all duration-300 flex flex-col h-full">
        {listing?.car?.photos && listing?.car?.photos.length > 0 ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={listing.car.photos[0].url}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-surface-2 flex items-center justify-center">
            <Tag className="text-text-primary" size={40} />
          </div>
        )}

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-text-primary truncate flex-1">
              {listing.title}
            </h3>
          </div>

          <div className="mt-auto space-y-2">
            <p className="text-accent font-bold text-xl">
              {listing.price.toLocaleString()} {listing.currency}
            </p>

            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-text-secondary" />
                {listing.location || "N/A"}
              </span>
              {listing.year && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-text-secondary" />
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
    <div className="relative min-h-screen bg-background text-text-primary">
      <div className="relative z-10 max-w-7xl mx-auto py-10 px-4">
        <PageHeader title="Marketplace" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-5 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by make, model or title..."
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              className="w-full bg-surface-1/60 border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent/20 focus:border-accent/50 outline-none transition-all"
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              onChange={(e) =>
                handleFilterChange("minPrice", Number(e.target.value))
              }
              className="w-1/2 bg-surface-1/60 border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-border"
            />
            <input
              type="number"
              placeholder="Max Price"
              onChange={(e) =>
                handleFilterChange("maxPrice", Number(e.target.value))
              }
              className="w-1/2 bg-surface-1/60 border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-border"
            />
          </div>

          <div className="md:col-span-2 relative">
            <ArrowUpDown
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              size={16}
            />
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full bg-surface-1/60 border border-border rounded-xl py-3 pl-10 pr-4 text-sm appearance-none outline-none focus:border-border"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="md:col-span-2 flex items-center justify-center gap-2 bg-surface-2 hover:bg-surface-2 text-text-secondary rounded-xl py-3 px-4 transition-colors"
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
            <div className="col-span-full py-20 flex flex-col items-center bg-surface-1/20 border border-dashed border-border rounded-3xl">
              <SlidersHorizontal size={48} className="text-text-muted mb-4" />
              <h3 className="text-xl font-medium text-text-secondary">
                No results found
              </h3>
              <p className="text-text-primary">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
