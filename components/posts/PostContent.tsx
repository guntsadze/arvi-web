"use client";

import { useState, useRef, useEffect } from "react";
import { EditPostModal } from "./EditPostModal";

interface PostContentProps {
  post: any;
  isEditing: boolean;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function PostContent({
  post,
  isEditing,
  onSave,
  onCancel,
}: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // თუ line-clamp იჭრის ტექსტს
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [post.content]);

  return (
    <>
      <div className="relative">
        <p
          ref={textRef}
          className={`whitespace-pre-wrap break-words font-mono text-sm text-stone-300 leading-relaxed transition-all ${
            !isExpanded ? "line-clamp-2" : ""
          }`}
        >
          {post.content}
        </p>

        {isOverflowing && (
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="mt-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <EditPostModal
        post={post}
        isOpen={isEditing}
        onClose={onCancel}
        onSave={onSave}
      />
    </>
  );
}
