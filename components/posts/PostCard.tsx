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
      editCommentForm.reset();
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (
    commentId: string,
    data: { content: string }
  ) => {
    try {
      await postsService.updateComment(commentId, data.content);
      setPartialState({ editingCommentId: null });
      editCommentForm.reset();
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await postsService.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const rootComments = state.comments.filter((c) => !c.parentId);

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link
          href={`/profile/${post.user.username}`}
          className="flex items-center gap-3"
        >
          <Image
            src={post.user.avatar || "/default-avatar.png"}
            alt={post.user.firstName}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold flex items-center gap-1">
              {post.user.firstName} {post.user.lastName}{" "}
              {post.user.isVerified && <span className="text-blue-500">✓</span>}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ka,
              })}
            </p>
          </div>
        </Link>
      </div>

      {/* Content / Edit */}
      <div className="px-4 pb-3">
        {state.editingPost ? (
          <form
            onSubmit={editPostForm.handleSubmit(handleUpdatePost)}
            className="flex gap-2"
          >
            <input
              {...editPostForm.register("content")}
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-2 rounded text-sm"
            >
              შენახვა
            </button>
            <button
              type="button"
              onClick={() => setPartialState({ editingPost: false })}
              className="px-2 rounded text-sm border"
            >
              გაუქმება
            </button>
          </form>
        ) : (
          <p className="whitespace-pre-wrap">{post.content}</p>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-red-500"
          >
            <Heart
              className={state.isLiked ? "fill-red-500 text-red-500" : ""}
              size={24}
            />
            <span>{state.likesCount}</span>
          </button>
          <button
            onClick={() =>
              setPartialState({ showComments: !state.showComments })
            }
            className="flex items-center gap-1 hover:text-blue-500"
          >
            <MessageCircle size={24} />
            <span>{post.commentsCount}</span>
          </button>
          <button className="hover:text-green-500">
            <Share2 size={24} />
          </button>
          <button
            onClick={handleDeletePost}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={24} />
          </button>
          <button
            onClick={() => setPartialState({ editingPost: true })}
            className="hover:text-yellow-500"
          >
            <Edit2 size={24} />
          </button>
        </div>
        <button onClick={handleSave} className="hover:text-yellow-500">
          <Bookmark
            className={state.isSaved ? "fill-yellow-500 text-yellow-500" : ""}
            size={24}
          />
        </button>
      </div>

      {/* Comments */}
      {state.showComments && (
        <div className="px-4 pb-3 space-y-2">
          {/* Add new comment */}
          <form
            onSubmit={commentForm.handleSubmit((data) =>
              handleAddComment(data)
            )}
            className="flex gap-2"
          >
            <input
              {...commentForm.register("content")}
              placeholder="კომენტარის დამატება..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-2 rounded text-sm"
            >
              დამატება
            </button>
          </form>

          {/* Comments list */}
          {rootComments.map((c) => (
            <div key={c.id} className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <Image
                  src={c.user.avatar || "/default-avatar.png"}
                  alt={c.user.firstName}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div className="bg-gray-100 rounded px-2 py-1 w-full text-sm">
                  <p className="font-semibold">
                    {c.user.firstName} {c.user.lastName}
                  </p>
                  {state.editingCommentId === c.id ? (
                    <form
                      onSubmit={editCommentForm.handleSubmit((data) =>
                        handleEditComment(c.id, data)
                      )}
                      className="flex gap-2"
                    >
                      <input
                        {...editCommentForm.register("content")}
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-2 rounded text-sm"
                      >
                        შენახვა
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPartialState({ editingCommentId: null })
                        }
                        className="px-2 rounded border text-sm"
                      >
                        გაუქმება
                      </button>
                    </form>
                  ) : (
                    <p>{c.content}</p>
                  )}
                  <div className="flex gap-2 text-xs mt-1">
                    <button
                      onClick={() => setPartialState({ replyTo: c.id })}
                      className="text-blue-500"
                    >
                      პასუხი
                    </button>
                    <button
                      onClick={() => {
                        editCommentForm.setValue("content", c.content);
                        setPartialState({ editingCommentId: c.id });
                      }}
                      className="text-yellow-500"
                    >
                      რედაქტირება
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-500"
                    >
                      წაშლა
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {state.replyTo === c.id && (
                <form
                  onSubmit={commentForm.handleSubmit((data) =>
                    handleAddComment(data, c.id)
                  )}
                  className="ml-10 flex gap-2"
                >
                  <input
                    {...commentForm.register("content")}
                    placeholder="პასუხი..."
                    className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-2 rounded text-sm"
                  >
                    გაგზავნა
                  </button>
                </form>
              )}

              {c.replies?.map((r) => (
                <div key={r.id} className="ml-10 flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <Image
                      src={r.user.avatar || "/default-avatar.png"}
                      alt={r.user.firstName}
                      width={26}
                      height={26}
                      className="rounded-full"
                    />
                    <div className="bg-gray-200 rounded px-2 py-1 text-sm w-full">
                      <p className="font-semibold">
                        {r.user.firstName} {r.user.lastName}
                      </p>
                      {state.editingReplyId === r.id ? (
                        <form
                          onSubmit={editCommentForm.handleSubmit(
                            (data) => handleEditComment(r.id, data, true) // true ნიშნავს, რომ ეს პასუხია
                          )}
                          className="flex gap-2"
                        >
                          <input
                            {...editCommentForm.register("content")}
                            className="flex-1 border rounded px-2 py-1 text-sm"
                          />
                          <button
                            type="submit"
                            className="bg-blue-500 text-white px-2 rounded text-sm"
                          >
                            შენახვა
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPartialState({ editingReplyId: null })
                            }
                            className="px-2 rounded border text-sm"
                          >
                            გაუქმება
                          </button>
                        </form>
                      ) : (
                        <p>{r.content}</p>
                      )}
                      <div className="flex gap-2 text-xs mt-1">
                        <button
                          onClick={() => {
                            editCommentForm.setValue("content", r.content);
                            setPartialState({ editingReplyId: r.id });
                          }}
                          className="text-yellow-500"
                        >
                          რედაქტირება
                        </button>
                        <button
                          onClick={() => handleDeleteComment(r.id, true)}
                          className="text-red-500"
                        >
                          წაშლა
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
