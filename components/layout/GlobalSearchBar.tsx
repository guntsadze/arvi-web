"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Car,
  FileText,
  Users2,
  Calendar,
  ShoppingBag,
  X,
  Loader2,
} from "lucide-react";
import { SearchResults, searchService } from "@/services/search.service";
import Image from "next/image";

export function GlobalSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);

        const searchResults = await searchService.globalSearch({
          query,
          limit: 5,
        });

        setResults(searchResults ?? null);
        setIsOpen(true); // ყოველთვის ვხსნით, თუ მოვიდა რამე (ან ცარიელიც კი)
      } catch (error) {
        console.error("Search error:", error);
        setResults(null);
        setIsOpen(true); // no results-ის საჩვენებლადაც გახსნა
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Clear search
  const handleClear = () => {
    setQuery("");
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Total results count
  const getTotalResults = () => {
    if (!results) return 0;
    return Object.values(results).reduce(
      (acc, arr) => acc + (arr?.length || 0),
      0,
    );
  };

  const hasResults = results && getTotalResults() > 0;

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"
          size={14}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ძებნა..."
          className="w-full pl-10 pr-10 py-2 bg-stone-800 text-white placeholder:text-stone-300 focus:border-amber-500 focus:outline-none transition-colors font-mono text-xs rounded-md"
        />

        {/* Loading / Clear */}
        {isLoading ? (
          <Loader2
            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin"
            size={20}
          />
        ) : (
          query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-amber-500 transition-colors"
            >
              <X size={20} />
            </button>
          )
        )}
      </div>

      {/* Dropdown - ყოველთვის ჩანს, როცა isOpen = true */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-[#1a1918] border-2 border-stone-700 shadow-2xl z-50 max-h-[500px] overflow-y-auto custom-scrollbar rounded-md">
          {/* თუ არის შედეგები */}
          {hasResults && (
            <>
              {/* Users */}
              {results.users.length > 0 && (
                <div className="border-b border-stone-800">
                  <div className="px-4 py-2 bg-stone-900 text-amber-500 text-xs font-mono uppercase flex items-center gap-2">
                    <Users size={14} />
                    <span>მომხმარებლები</span>
                  </div>
                  {results.users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.username}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-amber-500 font-bold overflow-hidden">
                        {user.avatar ? (
                          <Image
                            src={user.avatar?.url}
                            alt={user.username}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.firstName[0].toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">
                            {user.firstName} {user.lastName}
                          </span>
                          {user.isVerified && (
                            <span className="text-amber-500 text-xs">✓</span>
                          )}
                        </div>
                        <div className="text-stone-400 text-sm">
                          @{user.username}
                        </div>
                      </div>
                      <div className="text-stone-300 text-xs">
                        {user.followersCount} followers
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Cars */}
              {results.cars.length > 0 && (
                <div className="border-b border-stone-800">
                  <div className="px-4 py-2 bg-stone-900 text-amber-500 text-xs font-mono uppercase flex items-center gap-2">
                    <Car size={14} />
                    <span>მანქანები</span>
                  </div>
                  {results.cars.map((car) => (
                    <Link
                      key={car.id}
                      href={`/cars/${car.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800 transition-colors"
                    >
                      <Car className="text-amber-500" size={20} />
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {car.make} {car.model}
                        </div>
                        {car.nickname && (
                          <div className="text-stone-400 text-sm">
                            "{car.nickname}"
                          </div>
                        )}
                        <div className="text-stone-300 text-xs">
                          by @{car.user.username}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Posts, Groups, Events, Listings — ანალოგიურად */}
              {/* (შენი ორიგინალური კოდიდან დარჩა უცვლელი) */}

              {results.posts.length > 0 && (
                <div className="border-b border-stone-800">
                  <div className="px-4 py-2 bg-stone-900 text-amber-500 text-xs font-mono uppercase flex items-center gap-2">
                    <FileText size={14} />
                    <span>პოსტები</span>
                  </div>
                  {results.posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="text-white text-sm line-clamp-2 mb-1">
                          {post.content}
                        </div>
                        <div className="flex items-center gap-3 text-stone-300 text-xs">
                          <span>by @{post.user.username}</span>
                          <span>❤️ {post._count.likes}</span>
                          <span>💬 {post._count.comments}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.groups.length > 0 && (
                <div className="border-b border-stone-800">
                  <div className="px-4 py-2 bg-stone-900 text-amber-500 text-xs font-mono uppercase flex items-center gap-2">
                    <Users2 size={14} />
                    <span>ჯგუფები</span>
                  </div>
                  {results.groups.map((group) => (
                    <Link
                      key={group.id}
                      href={`/groups/${group.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800 transition-colors"
                    >
                      <Users2 className="text-amber-500" size={20} />
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {group.name}
                        </div>
                        {group.description && (
                          <div className="text-stone-400 text-sm line-clamp-1">
                            {group.description}
                          </div>
                        )}
                        <div className="text-stone-300 text-xs">
                          by @{group.owner.username}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.events.length > 0 && (
                <div className="border-b border-stone-800">
                  <div className="px-4 py-2 bg-stone-900 text-amber-500 text-xs font-mono uppercase flex items-center gap-2">
                    <Calendar size={14} />
                    <span>ივენთები</span>
                  </div>
                  {results.events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800 transition-colors"
                    >
                      <Calendar className="text-amber-500" size={20} />
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {event.title}
                        </div>
                        {event.location && (
                          <div className="text-stone-400 text-sm">
                            {event.location}
                          </div>
                        )}
                        <div className="text-stone-300 text-xs">
                          {new Date(event.startDate).toLocaleDateString(
                            "ka-GE",
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.listings.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-stone-900 text-amber-500 text-xs font-mono uppercase flex items-center gap-2">
                    <ShoppingBag size={14} />
                    <span>გაყიდვები</span>
                  </div>
                  {results.listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/marketplace/${listing.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800 transition-colors"
                    >
                      <ShoppingBag className="text-amber-500" size={20} />
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {listing.title}
                        </div>
                        <div className="text-stone-400 text-sm">
                          {listing.make} {listing.model}
                        </div>
                        {listing.price && (
                          <div className="text-amber-500 text-sm font-bold">
                            ${listing.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* No results */}
          {!hasResults && results !== null && (
            <div className="p-8 text-center">
              <Search className="mx-auto mb-3 text-[#EBE9E1]" size={40} />
              <p className="text-stone-400 font-mono">
                შედეგი ვერ მოიძებნა "{query}"-ზე
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
