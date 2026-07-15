import { apiClient } from "@/lib/api";

export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";

export interface MediaDto {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  mediaType: MediaType;
  format: string;
  width: number | null;
  height: number | null;
  bytes: number;
  duration: number | null;
  provider: string;
  createdAt: string;
}

/**
 * The single upload entrypoint for every image/video in the app — cars,
 * posts, avatars, listings, chat, all of it. Upload the raw file here first
 * to get a Media object back, then submit the entity's own form with just
 * `mediaIds: [media.id, ...]` to attach it. See docs/MEDIA_REFACTOR_PROPOSAL.md.
 */
export const mediaService = {
  upload: (
    file: File,
    folder?: string,
    onProgress?: (percent: number) => void,
  ): Promise<MediaDto> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);
    return apiClient.postForm<MediaDto>("/media", formData, onProgress);
  },

  remove: (id: string): Promise<void> => apiClient.delete(`/media/${id}`),
};
