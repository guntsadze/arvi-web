// import { useState, useRef, useEffect } from "react";
// import { Smile, Image as ImageIcon } from "lucide-react";
// import { UserAvatarItem } from "../ui/UserAvatarItem";
// import { useAppSelector } from "@/store/hooks";
// import { selectCurrentUser } from "@/store/slices/userSlice";
// import { cn } from "@/lib/utils";

// interface CommentFormProps {
//   onSubmit: (data: { content: string; files?: File[] }) => Promise<void> | void;
//   placeholder?: string;
//   autoFocus?: boolean;
// }

// export function CommentForm({
//   onSubmit,
//   placeholder = "Add a comment...",
//   autoFocus = false,
// }: CommentFormProps) {
//   const [content, setContent] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const currentUser = useAppSelector(selectCurrentUser);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // ტექსტარეას სიმაღლის ავტომატური ზრდა
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "inherit";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [content]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!content.trim() || isSubmitting) return;

//     try {
//       setIsSubmitting(true);
//       await onSubmit({ content });
//       setContent("");
//     } catch (error) {
//       console.error("Failed to submit comment:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex gap-3 px-4 py-3 items-start">
//       {/* მომხმარებლის ავატარი */}
//       <div className="flex-shrink-0 mt-1">
//         <UserAvatarItem user={currentUser} size="sm" showName={false} />
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className="flex-1 flex flex-col border border-border  bg-transparent focus-within:border-border transition-all overflow-hidden"
//       >
//         {/* ტექსტის შესაყვანი ველი */}
//         <textarea
//           ref={textareaRef}
//           rows={1}
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder={placeholder}
//           autoFocus={autoFocus}
//           disabled={isSubmitting}
//           className="w-full bg-transparent px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none resize-none min-h-[45px] max-h-[200px]"
//         />

//         {/* ქვედა პანელი: იკონები და ღილაკი */}
//         <div className="flex items-center justify-between px-3 pb-2">
//           <div className="flex items-center gap-3 text-text-secondary">
//             <button
//               type="button"
//               className="hover:bg-surface-1-hover p-1.5 rounded-full transition-colors"
//             >
//               <Smile size={20} />
//             </button>
//             <button
//               type="button"
//               className="hover:bg-surface-1-hover p-1.5 rounded-full transition-colors"
//             >
//               <ImageIcon size={20} />
//             </button>
//           </div>

//           {/* Comment ღილაკი - ჩნდება მხოლოდ მაშინ, როცა ტექსტი წერია */}
//           {content.trim() && (
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={cn(
//                 "px-4 py-1.5 bg-link hover:bg-link-hover text-white text-[14px] font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed",
//                 isSubmitting && "animate-pulse",
//               )}
//             >
//               {isSubmitting ? "დამატება..." : "დამატება"}
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Smile, Image as ImageIcon, Video } from "lucide-react";
import { UserAvatarItem } from "../ui/UserAvatarItem";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { cn } from "@/lib/utils";
import { useMediaUpload } from "@/hooks/useMediaUpload";

interface CommentFormValues {
  content: string;
  mediaIds: string[];
}

interface CommentFormProps {
  onSubmit: (data: CommentFormValues) => Promise<void> | void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  onSubmit,
  placeholder = "დაწერე კომენტარი...",
  autoFocus = false,
}: CommentFormProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Files upload to POST /media the moment they're picked (see
  // useMediaUpload) — submitting the comment just sends the finished ids.
  const { items, addFiles, mediaIds, isUploading, reset: resetMedia } =
    useMediaUpload("comments");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<{ content: string }>({
    defaultValues: {
      content: "",
    },
  });

  const contentValue = watch("content");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ტექსტარეას სიმაღლის კონტროლი
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [contentValue]);

  const onFormSubmit = async (data: { content: string }) => {
    try {
      await onSubmit({ ...data, mediaIds });
      reset();
      resetMedia([]);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const { ref, ...rest } = register("content");

  return (
    <div className="flex gap-3 px-4 py-3 items-start">
      <div className="flex-shrink-0 mt-1">
        <UserAvatarItem user={currentUser} size="sm" showName={false} />
      </div>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex-1 flex flex-col border border-border bg-transparent focus-within:border-border transition-all overflow-hidden rounded-lg"
      >
        <textarea
          {...rest}
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
          rows={1}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={isSubmitting}
          className="w-full bg-transparent px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none resize-none min-h-[45px] max-h-[200px]"
        />

        {items.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {items.map((item) => (
              <div
                key={item.localId}
                className="text-[10px] bg-surface-2 text-text-secondary px-2 py-1 rounded flex items-center gap-1"
              >
                {item.status === "uploading" ? `${item.progress}%` : item.kind === "video" ? "VID" : "IMG"}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-1 text-text-secondary">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(Array.from(e.target.files));
                e.target.value = "";
              }}
            />
            <div onClick={() => imageInputRef.current?.click()}>
              <MediaButton
                type="image"
                icon={ImageIcon}
                count={items.filter((i) => i.kind === "image").length}
                colorClass="text-text-primary hover:text-accent"
              />
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(Array.from(e.target.files));
                e.target.value = "";
              }}
            />
            <div onClick={() => videoInputRef.current?.click()}>
              <MediaButton
                type="video"
                icon={Video}
                count={items.filter((i) => i.kind === "video").length}
                colorClass="text-text-primary hover:text-info"
              />
            </div>

            <button
              type="button"
              className="hover:bg-surface-1-hover p-1.5 rounded-full transition-colors"
            >
              <Smile size={20} />
            </button>
          </div>

          {(contentValue?.trim() || items.length > 0) && (
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={cn(
                "px-4 py-1.5 bg-link hover:bg-link-hover text-white text-[14px] font-semibold rounded-full transition-all disabled:opacity-50",
                isSubmitting && "animate-pulse",
              )}
            >
              {isSubmitting ? "დამატება..." : "დამატება"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const MediaButton = ({ type, icon: Icon, count, colorClass }: any) => (
  <button
    type="button"
    className={`relative p-2 transition-all rounded hover:bg-surface-1-hover/50 ${colorClass}`}
  >
    <Icon size={16} />
    {count > 0 && (
      <span
        className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-[8px] text-white flex items-center justify-center font-bold rounded-full border border-surface-1 ${type === "image" ? "bg-accent" : "bg-info"}`}
      >
        {count}
      </span>
    )}
  </button>
);
