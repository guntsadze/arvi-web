"use client";

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
  return (
    <>
      <p className="whitespace-pre-wrap font-mono text-sm text-stone-300 leading-relaxed">
        {post.content}
      </p>

      <EditPostModal
        post={post}
        isOpen={isEditing}
        onClose={onCancel}
        onSave={onSave}
      />
    </>
  );
}
