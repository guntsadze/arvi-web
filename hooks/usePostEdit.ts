"use client";
import { useState } from "react";
import { postsService } from "@/services/posts/posts.service";
import { Post } from "@/types/post.types";

type PostType = "regular" | "group";

export function usePostEdit(
  postId: string,
  onSuccess: () => void,
  type: PostType = "regular",
) {
  const [isOpen, setIsOpen] = useState(false);
  const [postData, setPostData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = async () => {
    setIsOpen(true);
    setIsLoading(true);
    try {
      const fresh =
        type === "group"
          ? await postsService.getGroupPost(postId)
          : await postsService.getPost(postId);
      setPostData(fresh);
    } catch (err) {
      setError("პოსტის ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setPostData(null);
    setError(null);
  };

  const handleSave = async (data) => {
    try {
      type === "group"
        ? await postsService.updateGroupPost(postId, data)
        : await postsService.updatePost(postId, data);
      closeModal();
      onSuccess();
    } catch (err) {
      throw err;
    }
  };

  return {
    isOpen,
    isLoading,
    postData,
    error,
    openModal,
    closeModal,
    handleSave,
  };
}
