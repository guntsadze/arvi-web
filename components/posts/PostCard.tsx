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
  X,
  Check,
  Save,
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
  replies?: Comment[]; // დავამატე ტიპი პასუხებისთვის
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
    editingReplyId: null as string | null, // ეს დავამატე რომ პასუხის რედაქტირება არ აირიოს
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
      setPartialState({ comments: res.data || [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    try {
      await postsService.likePost(post.id);
      setPartialState({
        isLiked: !state.isLiked,
        likesCount: state.isLiked ? state.likesCount - 1 : state.likesCount + 1,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await postsService.savePost(post.id);
      setPartialState({ isSaved: !state.isSaved });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("ნამდვილად გსურს პოსტის წაშლა?")) return;
    try {
      await postsService.deletePost(post.id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (data: { content: string }) => {
    try {
      await postsService.updatePost(post.id, data);
      setPartialState({ editingPost: false });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (
    data: { content: string },
    parentId?: string
  ) => {
    if (!data.content.trim()) return;
    try {
      await postsService.addComment(post.id.toString(), data.content, parentId);
      commentForm.reset();
      // აქ შეგიძლიათ editCommentForm-იც დაარესეტოთ თუ საჭიროა, თუმცა ძირითადად commentForm გვჭირდება
      fetchComments();
      setPartialState({ replyTo: null }); // დახუროს პასუხის ფანჯარა გაგზავნის შემდეგ
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (
    commentId: string,
    data: { content: string },
    isReply: boolean = false
  ) => {
    try {
      await postsService.updateComment(commentId, data.content);
      setPartialState({ editingCommentId: null, editingReplyId: null });
      editCommentForm.reset();
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("წავშალოთ კომენტარი?")) return;
    try {
      await postsService.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const rootComments = state.comments.filter((c) => !c.parentId);

  return (
    <div className="relative mb-10 group/card">
      {/* Tape Effect (სკოჩი) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#d4c5a3] opacity-90 rotate-1 shadow-sm z-20" />

      {/* Main Card Container */}
      <div className="bg-[#f2f0e9] border-l-4 border-stone-800 shadow-[4px_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-stone-300 border-dashed">
          <Link
            href={`/profile/${post.user.username}`}
            className="flex items-center gap-3 group/user"
          >
            <div className="relative">
              <Image
                src={post.user.avatar || "/default-avatar.png"}
                alt={post.user.firstName}
                width={44}
                height={44}
                className="rounded-none border-2 border-stone-800 grayscale group-hover/user:grayscale-0 transition-all"
              />
              {post.user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 border border-white" />
              )}
            </div>
            <div>
              <p className="font-black text-stone-800 uppercase tracking-wide text-sm flex items-center gap-1 group-hover/user:text-amber-600 transition-colors">
                {post.user.firstName} {post.user.lastName}
              </p>
              <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: ka,
                })}
              </p>
            </div>
          </Link>

          {/* Menu Dots (Visual only for now) */}
          <MoreHorizontal className="text-stone-400" size={20} />
        </div>

        {/* Content Section */}
        <div className="p-6 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          {state.editingPost ? (
            <form
              onSubmit={editPostForm.handleSubmit(handleUpdatePost)}
              className="space-y-3"
            >
              <textarea
                {...editPostForm.register("content")}
                rows={4}
                className="w-full bg-white border-2 border-amber-500 p-3 font-serif text-lg text-stone-900 focus:outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setPartialState({ editingPost: false })}
                  className="px-3 py-1 text-xs uppercase font-bold border-2 border-stone-400 text-stone-600 hover:text-stone-900"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs uppercase font-bold bg-amber-600 text-white hover:bg-amber-700"
                >
                  შენახვა
                </button>
              </div>
            </form>
          ) : (
            <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-900">
              {post.content}
            </p>
          )}
        </div>

        {/* Actions Bar (Metallic Look) */}
        <div className="px-4 py-3 bg-[#e6e4dc] border-t border-stone-300 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 group/btn hover:scale-105 transition-transform"
            >
              <Heart
                className={`transition-colors ${
                  state.isLiked
                    ? "fill-red-700 text-red-700"
                    : "text-stone-600 group-hover/btn:text-red-700"
                }`}
                size={22}
              />
              <span className="font-mono text-xs font-bold text-stone-600">
                {state.likesCount}
              </span>
            </button>
            <button
              onClick={() =>
                setPartialState({ showComments: !state.showComments })
              }
              className="flex items-center gap-2 group/btn hover:scale-105 transition-transform"
            >
              <MessageCircle
                size={22}
                className="text-stone-600 group-hover/btn:text-amber-600 transition-colors"
              />
              <span className="font-mono text-xs font-bold text-stone-600">
                {post.commentsCount}
              </span>
            </button>
            <button className="text-stone-600 hover:text-stone-900 hover:scale-105 transition-transform">
              <Share2 size={22} />
            </button>
          </div>

          <div className="flex gap-4">
            {/* Edit Button */}
            <button
              onClick={() => setPartialState({ editingPost: true })}
              className="text-stone-400 hover:text-amber-600 transition-colors"
              title="რედაქტირება"
            >
              <Edit2 size={20} />
            </button>
            {/* Delete Button */}
            <button
              onClick={handleDeletePost}
              className="text-stone-400 hover:text-red-700 transition-colors"
              title="წაშლა"
            >
              <Trash2 size={20} />
            </button>
            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`transition-colors ${
                state.isSaved
                  ? "text-amber-600 fill-amber-600"
                  : "text-stone-400 hover:text-amber-600"
              }`}
              title="შენახვა"
            >
              <Bookmark size={20} />
            </button>
          </div>
        </div>

        {/* Comments Section (Torn Paper Note Look) */}
        {state.showComments && (
          <div className="bg-[#e3e1d5] border-t border-stone-300 p-5 shadow-inner">
            {/* New Comment Input */}
            <form
              onSubmit={commentForm.handleSubmit((data) =>
                handleAddComment(data)
              )}
              className="flex gap-2 mb-8"
            >
              <input
                {...commentForm.register("content")}
                placeholder="დაამატე ტექნიკური შენიშვნა..."
                className="flex-1 bg-white border border-stone-300 px-4 py-2 font-mono text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="bg-stone-800 text-white px-4 py-2 text-xs uppercase font-bold tracking-wider hover:bg-amber-600 transition-colors"
              >
                დამატება
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {rootComments.map((c) => (
                <div key={c.id} className="relative group/comment">
                  <div className="flex gap-3">
                    {/* Commenter Avatar */}
                    <Image
                      src={c.user.avatar || "/default-avatar.png"}
                      alt={c.user.firstName}
                      width={32}
                      height={32}
                      className="rounded-full border border-stone-400 h-8 w-8 object-cover"
                    />

                    <div className="flex-1">
                      {/* Comment Bubble */}
                      <div className="bg-white/60 p-3 border border-stone-300 border-l-2 border-l-amber-500 shadow-sm relative">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-xs uppercase text-stone-800 tracking-wider">
                            {c.user.firstName} {c.user.lastName}
                          </span>
                        </div>

                        {/* Editing Mode for Comment */}
                        {state.editingCommentId === c.id ? (
                          <form
                            onSubmit={editCommentForm.handleSubmit((data) =>
                              handleEditComment(c.id, data)
                            )}
                            className="flex gap-2 mt-2"
                          >
                            <input
                              {...editCommentForm.register("content")}
                              className="flex-1 border border-amber-500 px-2 py-1 text-sm bg-white"
                              autoFocus
                            />
                            <button type="submit" className="text-amber-600">
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPartialState({ editingCommentId: null })
                              }
                              className="text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </form>
                        ) : (
                          <p className="text-sm text-stone-700 font-serif">
                            {c.content}
                          </p>
                        )}

                        {/* Comment Actions */}
                        <div className="flex gap-4 mt-2 pt-2 border-t border-stone-200 opacity-60 group-hover/comment:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPartialState({ replyTo: c.id })}
                            className="text-[10px] uppercase font-bold text-stone-500 hover:text-amber-600 flex items-center gap-1"
                          >
                            <CornerDownRight size={12} /> პასუხი
                          </button>
                          <button
                            onClick={() => {
                              editCommentForm.setValue("content", c.content);
                              setPartialState({ editingCommentId: c.id });
                            }}
                            className="text-[10px] uppercase font-bold text-stone-500 hover:text-blue-600"
                          >
                            რედაქტირება
                          </button>
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-[10px] uppercase font-bold text-stone-500 hover:text-red-600"
                          >
                            წაშლა
                          </button>
                        </div>
                      </div>

                      {/* Reply Form */}
                      {state.replyTo === c.id && (
                        <form
                          onSubmit={commentForm.handleSubmit((data) =>
                            handleAddComment(data, c.id)
                          )}
                          className="flex gap-2 mt-2 ml-4 border-l-2 border-stone-300 pl-3"
                        >
                          <input
                            {...commentForm.register("content")}
                            placeholder="დაწერე პასუხი..."
                            className="flex-1 bg-white border border-stone-300 px-2 py-1 text-xs"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="bg-amber-600 text-white px-3 py-1 text-xs font-bold"
                          >
                            გაგზავნა
                          </button>
                        </form>
                      )}

                      {/* Nested Replies List */}
                      {c.replies?.map((r) => (
                        <div
                          key={r.id}
                          className="flex gap-3 mt-3 ml-6 pl-4 border-l-2 border-dashed border-stone-300"
                        >
                          <Image
                            src={r.user.avatar || "/default-avatar.png"}
                            alt={r.user.firstName}
                            width={24}
                            height={24}
                            className="rounded-full h-6 w-6 grayscale opacity-80"
                          />
                          <div className="flex-1 bg-white/40 p-2 border border-stone-200">
                            <span className="font-bold text-[10px] uppercase block text-stone-600 mb-1">
                              {r.user.firstName} {r.user.lastName}
                            </span>

                            {/* Editing Mode for Reply */}
                            {state.editingReplyId === r.id ? (
                              <form
                                onSubmit={editCommentForm.handleSubmit((data) =>
                                  handleEditComment(r.id, data, true)
                                )}
                                className="flex gap-2"
                              >
                                <input
                                  {...editCommentForm.register("content")}
                                  className="flex-1 border border-amber-500 px-2 py-1 text-xs"
                                />
                                <button
                                  type="submit"
                                  className="text-amber-600"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPartialState({ editingReplyId: null })
                                  }
                                  className="text-red-500"
                                >
                                  <X size={14} />
                                </button>
                              </form>
                            ) : (
                              <p className="text-xs text-stone-600 font-serif">
                                {r.content}
                              </p>
                            )}

                            <div className="flex gap-3 mt-1 justify-end opacity-0 group-hover/card:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  editCommentForm.setValue(
                                    "content",
                                    r.content
                                  );
                                  setPartialState({ editingReplyId: r.id });
                                }}
                                className="text-[10px] text-stone-400 hover:text-blue-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(r.id)}
                                className="text-[10px] text-stone-400 hover:text-red-600"
                              >
                                Del
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
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
