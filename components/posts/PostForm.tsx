"use client";

import { useState } from "react";
import { Image as ImageIcon, Video, MapPin, Send } from "lucide-react";
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
    <div className="relative mb-8 group">
      {/* Torn Effect Background */}
      <div
        className="absolute inset-0 bg-stone-900 translate-x-1 translate-y-1"
        style={{ filter: "url(#rugged-tear)" }}
      />
      <div
        className="relative bg-[#EBE9E1] p-5 border-2 border-stone-800"
        style={{ filter: "url(#rugged-tear)" }}
      >
        <div className="flex items-center gap-2 mb-4 border-b border-stone-300 pb-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
            New Entry // Garage Log
          </span>
        </div>

        <textarea
          placeholder="რა ხდება გარაჟში?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[100px] bg-transparent resize-none font-serif text-lg text-stone-900 placeholder:text-stone-400 outline-none"
        />

        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t-2 border-dashed border-stone-300">
          <div className="flex gap-1">
            {[
              { icon: ImageIcon, label: "Photo" },
              { icon: Video, label: "Video" },
              { icon: MapPin, label: "Location" },
            ].map((item, i) => (
              <button
                key={i}
                className="flex items-center px-3 py-1 text-[10px] uppercase font-bold text-stone-600 hover:bg-stone-200 border border-transparent hover:border-stone-400 transition-all"
              >
                <item.icon size={14} className="mr-1" /> {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-amber-500 font-black uppercase tracking-tighter hover:bg-amber-600 hover:text-stone-900 disabled:opacity-30 transition-all shadow-[4px_4px_0px_0px_rgba(245,158,11,0.3)]"
          >
            {loading ? "Sending..." : "Post Entry"} <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
