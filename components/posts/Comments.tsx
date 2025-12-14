"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, Trash2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";

interface CommentUser {
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
}

interface CommentProps {
  comment: {
    id: string;
    content: string;
    user: CommentUser;
    createdAt: string;
    replies?: CommentProps["comment"][];
  };
  currentUserId: string;
  isReply?: boolean;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
}

export function Comment({
  comment,
  currentUserId,
  isReply = false,
  onReply,
  onEdit,
  onDelete,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = comment.user.username === currentUserId;

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={`flex flex-col gap-1 ${isReply ? "ml-10" : ""}`}>
      <div className="flex items-start gap-2">
        <Image
          src={comment.user.avatar || "/default-avatar.png"}
          alt={comment.user.firstName}
          width={isReply ? 26 : 30}
          height={isReply ? 26 : 30}
          className="rounded-full flex-shrink-0"
        />

        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-3 rounded text-sm hover:bg-blue-600 transition"
              >
                შენახვა
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div
              className={`${
                isReply ? "bg-gray-200" : "bg-gray-100"
              } rounded px-3 py-2 text-sm`}
            >
              <p className="font-semibold">
                {comment.user.firstName} {comment.user.lastName}
              </p>
              <p className="whitespace-pre-wrap break-words">
                {comment.content}
              </p>

              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: ka,
                  })}
                </span>

                {!isReply && onReply && (
                  <button
                    onClick={() => onReply(comment.id)}
                    className="text-blue-500 hover:underline"
                  >
                    პასუხი
                  </button>
                )}

                {isOwner && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <Edit2 size={12} />
                      რედაქტირება
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(comment.id)}
                        className="text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        წაშლა
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render Replies */}
      {comment.replies?.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          currentUserId={currentUserId}
          isReply={true}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
