"use client";

import { useState, useRef, useEffect } from "react";

interface PostContentProps {
  post: any;
}

export function PostContent({ post }: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [post.content]);

  return (
    <>
      <div className="relative">
        <p
          ref={textRef}
          className={`whitespace-pre-wrap break-words font-mono text-sm text-text-secondary leading-relaxed transition-all ${
            !isExpanded ? "line-clamp-2" : ""
          }`}
        >
          {post.content}
        </p>

        {isOverflowing && (
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="mt-1 text-xs font-semibold text-info hover:text-info transition-colors"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </>
  );
}
