import { useCallback, useState } from "react";
import { mediaService, MediaDto } from "@/services/media.service";
import { getErrorMessage } from "@/lib/error-handler";

export interface MediaUploadItem {
  localId: string;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  progress: number;
  /** Known immediately from the picked File's mimetype, before upload finishes. */
  kind: "image" | "video";
  media?: MediaDto;
  error?: string;
}

function toItem(media: MediaDto): MediaUploadItem {
  return {
    localId: media.id,
    previewUrl: media.thumbnailUrl ?? media.url,
    status: "done",
    progress: 100,
    kind: media.mediaType === "VIDEO" ? "video" : "image",
    media,
  };
}

/**
 * Uploads files to POST /media the moment they're selected (not on form
 * submit) — by the time the user finishes the form, every photo is already
 * uploaded and `mediaIds` is just a list of ids to send along. Removing an
 * item that already finished uploading deletes it server-side immediately
 * too, so nothing gets orphaned in storage if the user changes their mind
 * mid-form. See docs/MEDIA_REFACTOR_PROPOSAL.md for the two-step flow this
 * implements.
 */
export function useMediaUpload(folder?: string, initialMedia: MediaDto[] = []) {
  const [items, setItems] = useState<MediaUploadItem[]>(
    initialMedia.map(toItem),
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const newItems: MediaUploadItem[] = files.map((file) => ({
        localId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        previewUrl: URL.createObjectURL(file),
        status: "uploading",
        progress: 0,
        kind: file.type.startsWith("video/") ? "video" : "image",
      }));

      setItems((prev) => [...prev, ...newItems]);

      newItems.forEach((item, i) => {
        const file = files[i];
        mediaService
          .upload(file, folder, (progress) =>
            setItems((prev) =>
              prev.map((it) =>
                it.localId === item.localId ? { ...it, progress } : it,
              ),
            ),
          )
          .then((media) => {
            setItems((prev) =>
              prev.map((it) =>
                it.localId === item.localId
                  ? { ...it, status: "done", progress: 100, media }
                  : it,
              ),
            );
          })
          .catch((error) => {
            setItems((prev) =>
              prev.map((it) =>
                it.localId === item.localId
                  ? { ...it, status: "error", error: getErrorMessage(error) }
                  : it,
              ),
            );
          });
      });
    },
    [folder],
  );

  const removeItem = useCallback((localId: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.localId === localId);
      if (target?.media) {
        mediaService.remove(target.media.id).catch(() => {});
      }
      if (target?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((it) => it.localId !== localId);
    });
  }, []);

  const reset = useCallback((media: MediaDto[] = []) => {
    setItems(media.map(toItem));
  }, []);

  const doneMedia = items
    .filter((it): it is MediaUploadItem & { media: MediaDto } => it.status === "done" && !!it.media)
    .map((it) => it.media);

  return {
    items,
    addFiles,
    removeItem,
    reset,
    mediaIds: doneMedia.map((m) => m.id),
    doneMedia,
    isUploading: items.some((it) => it.status === "uploading"),
  };
}
