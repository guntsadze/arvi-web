"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  MapPin,
  Send,
  Terminal,
} from "lucide-react";
import { postsService } from "@/services/posts/posts.service";

export function PostForm({ refresh }: { refresh: () => void }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await postsService.createPost({ content });
      setContent("");
      refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-12 group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-amber-900/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-[#201d1b] border border-stone-800 p-1">
        {/* Tech Corners */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-600/50 group-focus-within:border-amber-500 transition-colors" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-600/50 group-focus-within:border-amber-500 transition-colors" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-600/50 group-focus-within:border-amber-500 transition-colors" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-600/50 group-focus-within:border-amber-500 transition-colors" />

        <div className="bg-[#1c1917] p-5 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-stone-800/50">
            <div className="p-1.5 bg-stone-900 border border-stone-700">
              <Terminal size={14} className="text-amber-600" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 group-focus-within:text-amber-600 transition-colors">
              // New_Log_Entry
            </span>
            <div className="flex-1 h-px bg-stone-800" />
          </div>

          <textarea
            placeholder="Initialize status update..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] bg-transparent resize-none font-mono text-sm text-[#EBE9E1] placeholder:text-stone-600 outline-none custom-scrollbar"
          />

          <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-stone-800 border-dashed">
            <div className="flex gap-2">
              {[
                { icon: ImageIcon, label: "IMG" },
                { icon: Video, label: "VID" },
                { icon: MapPin, label: "LOC" },
              ].map((item, i) => (
                <button
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-700 hover:border-amber-600 text-[10px] font-mono uppercase text-stone-500 hover:text-amber-500 transition-all"
                >
                  <item.icon size={12} /> {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="flex items-center gap-2 px-6 py-2 bg-amber-700 text-stone-900 font-black uppercase text-xs tracking-widest hover:bg-amber-600 disabled:opacity-30 disabled:hover:bg-amber-700 transition-all shadow-[0_0_15px_rgba(180,83,9,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] clip-path-slant"
            >
              {loading ? "UPLOADING..." : "COMMIT LOG"} <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-path-slant {
          clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
          );
        }
      `}</style>
    </div>
  );
}
