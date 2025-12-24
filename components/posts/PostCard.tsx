"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Trash2,
  Edit2,
  CornerDownRight,
  MoreHorizontal,
  Check,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";
import { postsService } from "@/services/posts/posts.service";

interface Comment {
  id: string;
  content: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

interface PostCardProps {
  post: any;
  refresh: () => void;
}

export function PostCard({ post, refresh }: PostCardProps) {
  const [state, setState] = useState({
    isLiked: post.isLiked || false,
    isSaved: post.isSaved || false,
    likesCount: post.likesCount || 0,
    showComments: false,
    replyTo: null as string | null,
    comments: [] as Comment[],
    editingCommentId: null as string | null,
    editingReplyId: null as string | null,
    editingPost: false,
  });

  const commentForm = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });
  const editPostForm = useForm<{ content: string }>({
    defaultValues: { content: post.content },
  });
  const editCommentForm = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });

  const setPartialState = (partial: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...partial }));

  useEffect(() => {
    if (state.showComments) fetchComments();
  }, [state.showComments]);

  const fetchComments = async () => {
    try {
      const res = await postsService.getComments(post.id.toString());
      const data = Array.isArray(res) ? res : res.data || [];
      setPartialState({ comments: data });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await postsService.likePost(post.id);
      setPartialState({
        isLiked: res.liked,
        likesCount: res.likesCount,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await postsService.savePost(post.id);
      setPartialState({ isSaved: res.saved });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Confirm Deletion?")) return;
    try {
      await postsService.deletePost(post.id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (data: { content: string }) => {
    try {
      // ოპტიმისტური UI – პირდაპირ state-ში ვანახლებთ
      setPartialState({ editingPost: false });
      post.content = data.content; // სწრაფი ცვლილება UI-ში

      // მერე ვუკავშირდებით სერვისს
      await postsService.updatePost(post.id, data);
    } catch (err) {
      console.error(err);
      // შეცდომის შემთხვევაში შეიძლება revert გავაკეთოთ
    }
  };

  const handleAddComment = async (
    data: { content: string },
    parentId?: string
  ) => {
    if (!data.content.trim()) return;
    try {
      const newComment = await postsService.addComment(
        post.id,
        data.content,
        parentId
      );
      if (parentId) {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === parentId
              ? { ...c, replies: [newComment, ...(c.replies || [])] }
              : c
          ),
          replyTo: null,
        });
      } else {
        setPartialState({
          comments: [newComment, ...state.comments],
        });
      }
      commentForm.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (
    commentId: string,
    data: { content: string },
    isReply = false,
    parentId?: string
  ) => {
    try {
      const updatedComment = await postsService.updateComment(
        commentId,
        data.content
      );

      if (isReply && parentId) {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === parentId
              ? {
                  ...c,
                  replies: c.replies?.map((r) =>
                    r.id === commentId
                      ? { ...r, content: updatedComment.content }
                      : r
                  ),
                }
              : c
          ),
          editingReplyId: null,
        });
      } else {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === commentId ? { ...c, content: updatedComment.content } : c
          ),
          editingCommentId: null,
        });
      }
      editCommentForm.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (
    commentId: string,
    isReply = false,
    parentId?: string
  ) => {
    if (!confirm("Delete comment?")) return;
    try {
      await postsService.deleteComment(commentId);

      if (isReply && parentId) {
        setPartialState({
          comments: state.comments.map((c) =>
            c.id === parentId
              ? { ...c, replies: c.replies?.filter((r) => r.id !== commentId) }
              : c
          ),
        });
      } else {
        setPartialState({
          comments: state.comments.filter((c) => c.id !== commentId),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative mb-8 group/card">
      <div className="bg-[#201d1b] border border-stone-800 hover:border-stone-600 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-700 to-transparent" />

        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-[#1c1917]">
          <Link
            href={`/profile/${post.user?.username}`}
            className="flex items-center gap-3 group/user"
          >
            <div className="relative p-0.5 bg-stone-800 border border-stone-600">
              <Image
                src={post.user?.avatar?.url || "/default-avatar.png"}
                alt={post.user?.firstName}
                width={40}
                height={40}
                className="grayscale group-hover/user:grayscale-0 transition-all"
              />
              {post.user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-stone-900 p-0.5 border border-stone-600">
                  <ShieldCheck size={10} className="text-amber-500" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#EBE9E1] uppercase tracking-wide text-xs group-hover/user:text-amber-500 transition-colors">
                  {post.user.firstName} {post.user.lastName}
                </p>
                <span className="text-[10px] text-stone-600 font-mono">
                  ID: {post.user.username}
                </span>
              </div>
              <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 border border-emerald-700 animate-pulse"></span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: ka,
                })}
              </p>
            </div>
          </Link>
          <MoreHorizontal
            className="text-stone-600 cursor-pointer hover:text-amber-600"
            size={20}
          />
        </div>

        <div className="p-6 bg-[#201d1b]">
          {state.editingPost ? (
            <form
              onSubmit={editPostForm.handleSubmit(handleUpdatePost)}
              className="space-y-4 border border-amber-600/30 p-4 bg-stone-900/50"
            >
              <textarea
                {...editPostForm.register("content")}
                rows={4}
                className="w-full bg-transparent font-mono text-[#EBE9E1] text-sm focus:outline-none placeholder:text-stone-600"
              />
              <div className="flex gap-2 justify-end pt-2 border-t border-dashed border-stone-700">
                <button
                  type="button"
                  onClick={() => setPartialState({ editingPost: false })}
                  className="px-3 py-1 text-[10px] uppercase font-bold text-stone-500 hover:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-[10px] uppercase font-bold bg-amber-700 text-stone-900 hover:bg-amber-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-stone-300">
              {post.content}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-stone-800 bg-[#181615]">
          <button
            onClick={handleLike}
            className={`flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase transition-colors hover:bg-stone-800 ${
              state.likesCount > 0
                ? "text-red-500"
                : "text-stone-500 hover:text-red-500"
            }`}
          >
            <Heart
              size={16}
              className={state.likesCount > 0 ? "fill-current" : ""}
            />
            <span>{state.likesCount}</span>
          </button>

          <button
            onClick={() =>
              setPartialState({ showComments: !state.showComments })
            }
            className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase text-stone-500 hover:text-amber-500 hover:bg-stone-800 transition-colors border-l border-stone-800"
          >
            <MessageCircle size={16} />
            <span>{post._count.comments}</span>
          </button>

          <button className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase text-stone-500 hover:text-blue-500 hover:bg-stone-800 transition-colors border-l border-stone-800">
            <Share2 size={16} />
          </button>

          <div className="flex items-center justify-center gap-4 py-3 border-l border-stone-800 hover:bg-stone-800">
            <button
              onClick={() => setPartialState({ editingPost: true })}
              className="text-stone-600 hover:text-stone-300"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDeletePost}
              className="text-stone-600 hover:text-red-900"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={handleSave}
              className={`${
                state.isSaved
                  ? "text-amber-600"
                  : "text-stone-600 hover:text-amber-600"
              }`}
            >
              <Bookmark
                size={14}
                className={state.isSaved ? "fill-current" : ""}
              />
            </button>
          </div>
        </div>

        {state.showComments && (
          <div className="bg-[#151413] border-t border-stone-800 p-6 shadow-inner">
            <form
              onSubmit={commentForm.handleSubmit((data) =>
                handleAddComment(data)
              )}
              className="flex gap-0 mb-8 border border-stone-700 bg-stone-900"
            >
              <div className="p-3 text-stone-600 border-r border-stone-700">
                <CornerDownRight size={16} />
              </div>
              <input
                {...commentForm.register("content")}
                placeholder="Append comment to log..."
                className="flex-1 bg-transparent px-4 py-2 font-mono text-xs text-[#EBE9E1] placeholder:text-stone-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 text-[10px] font-black uppercase text-amber-600 hover:bg-amber-900/20 hover:text-amber-500 transition-colors"
              >
                Exec
              </button>
            </form>

            <div className="space-y-6 pl-2">
              {state.comments.map((c) => (
                <div key={c.id} className="relative group/comment">
                  {/* Vertical Line for Thread */}
                  <div className="absolute left-4 top-8 bottom-0 w-px bg-stone-800 group-last/comment:hidden" />
                  <div className="flex gap-4">
                    <div className="relative h-8 w-8 min-w-[32px]">
                      <Image
                        src={c.user.avatar?.url || "/default-avatar.png"}
                        alt={c.user.firstName}
                        fill
                        className="border border-stone-600 object-cover grayscale opacity-70"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-[10px] uppercase text-stone-400 tracking-wider">
                          {c.user.firstName} {c.user.lastName}
                        </span>
                        <span className="text-[9px] text-stone-700 font-mono">
                          {formatDistanceToNow(new Date(c.createdAt), {
                            addSuffix: true,
                            locale: ka,
                          })}
                        </span>
                      </div>

                      {state.editingCommentId === c.id ? (
                        <form
                          onSubmit={editCommentForm.handleSubmit((data) =>
                            handleEditComment(c.id, data)
                          )}
                          className="flex gap-2 mb-2"
                        >
                          <input
                            {...editCommentForm.register("content")}
                            className="flex-1 bg-stone-800 border border-stone-600 text-[#EBE9E1] text-xs px-2 py-1 focus:outline-none"
                            autoFocus
                          />
                          <button type="submit" className="text-amber-600">
                            <Check size={14} />
                          </button>
                        </form>
                      ) : (
                        <p className="text-xs text-[#dcd8c8] font-mono leading-relaxed mb-2 opacity-90 border-l-2 border-stone-700 pl-3">
                          {c.content}
                        </p>
                      )}

                      <div className="flex gap-4 opacity-40 group-hover/comment:opacity-100 transition-opacity">
                        <button
                          onClick={() => setPartialState({ replyTo: c.id })}
                          className="text-[9px] uppercase font-bold text-stone-500 hover:text-amber-600"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            editCommentForm.setValue("content", c.content);
                            setPartialState({ editingCommentId: c.id });
                          }}
                          className="text-[9px] uppercase font-bold text-stone-500 hover:text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-[9px] uppercase font-bold text-stone-500 hover:text-red-500"
                        >
                          Del
                        </button>
                      </div>

                      {state.replyTo === c.id && (
                        <form
                          onSubmit={commentForm.handleSubmit((data) =>
                            handleAddComment(data, c.id)
                          )}
                          className="flex gap-2 mt-2 border-l border-amber-600/50 pl-2"
                        >
                          <input
                            {...commentForm.register("content")}
                            placeholder="Reply to log..."
                            className="flex-1 bg-stone-900 border border-stone-700 px-2 py-1 text-xs text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="text-[9px] text-amber-600 uppercase font-bold"
                          >
                            Send
                          </button>
                        </form>
                      )}

                      {c.replies && c.replies.length > 0 && (
                        <div className="mt-4 space-y-4 border-l border-stone-800 ml-4 pl-4">
                          {c.replies.map((r) => (
                            <div
                              key={r.id}
                              className="flex gap-3 relative group/reply"
                            >
                              <div className="absolute -left-4 top-3 w-3 h-px bg-stone-800" />
                              <div className="relative h-6 w-6 min-w-[24px]">
                                <Image
                                  src={
                                    r.user.avatar?.url || "/default-avatar.png"
                                  }
                                  alt={r.user.firstName}
                                  fill
                                  className="border border-stone-700 object-cover grayscale opacity-60"
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-[9px] font-bold text-amber-700/80 uppercase">
                                    {r.user.firstName} {r.user.lastName}
                                  </span>
                                  <span className="text-[8px] text-stone-600 font-mono">
                                    {formatDistanceToNow(
                                      new Date(r.createdAt),
                                      { addSuffix: true, locale: ka }
                                    )}
                                  </span>
                                </div>

                                {state.editingReplyId === r.id ? (
                                  <form
                                    onSubmit={editCommentForm.handleSubmit(
                                      (data) =>
                                        handleEditComment(
                                          r.id,
                                          data,
                                          true,
                                          c.id
                                        )
                                    )}
                                    className="flex gap-2 mb-2"
                                  >
                                    <input
                                      {...editCommentForm.register("content")}
                                      className="flex-1 bg-stone-800 border border-stone-600 text-[#EBE9E1] text-xs px-2 py-1 focus:outline-none"
                                      autoFocus
                                    />
                                    <button
                                      type="submit"
                                      className="text-amber-600"
                                    >
                                      <Check size={14} />
                                    </button>
                                  </form>
                                ) : (
                                  <p className="text-xs text-stone-400 font-mono leading-relaxed">
                                    {r.content}
                                  </p>
                                )}

                                <div className="flex gap-3 mt-1 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      editCommentForm.setValue(
                                        "content",
                                        r.content
                                      );
                                      setPartialState({ editingReplyId: r.id });
                                    }}
                                    className="text-[8px] text-stone-600 hover:text-blue-500 uppercase"
                                  >
                                    [Edit]
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(r.id, true, c.id)
                                    }
                                    className="text-[8px] text-stone-600 hover:text-red-500 uppercase"
                                  >
                                    [Del]
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
