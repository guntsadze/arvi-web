"use client";

import { useState } from "react";
import { Image as ImageIcon, Video, MapPin } from "lucide-react";
import { postsService } from "@/services/posts/posts.service";

interface PostFormProps {
  refresh: () => void;
}

export function PostForm({ refresh }: PostFormProps) {
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
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {/* <img src={user?.avatar} className="rounded-full w-full h-full" /> */}
          {/* <span className="font-medium">{user?.firstName?.[0]}</span> */}
        </div>

        {/* Form */}
        <div className="flex-1">
          <textarea
            placeholder="რას ფიქრობ?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] resize-none border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                <ImageIcon size={18} className="mr-1" />
                ფოტო
              </button>

              <button
                type="button"
                className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                <Video size={18} className="mr-1" />
                ვიდეო
              </button>

              <button
                type="button"
                className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                <MapPin size={18} className="mr-1" />
                ლოკაცია
              </button>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "იგზავნება..." : "გამოქვეყნება"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
