import { useState, useRef, useEffect } from "react";
import { Smile, Image as ImageIcon } from "lucide-react";
import { UserAvatarItem } from "../ui/UserAvatarItem";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  onSubmit: (data: { content: string; files?: File[] }) => Promise<void> | void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  onSubmit,
  placeholder = "Add a comment...",
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ტექსტარეას სიმაღლის ავტომატური ზრდა
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({ content });
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-3 px-4 py-3 items-start">
      {/* მომხმარებლის ავატარი */}
      <div className="flex-shrink-0 mt-1">
        <UserAvatarItem user={currentUser} size="sm" showName={false} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col border border-stone-700 rounded-[20px] bg-transparent focus-within:border-stone-500 transition-all overflow-hidden"
      >
        {/* ტექსტის შესაყვანი ველი */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={isSubmitting}
          className="w-full bg-transparent px-4 py-3 text-[14px] text-[#EBE9E1] placeholder:text-stone-500 focus:outline-none resize-none min-h-[45px] max-h-[200px]"
        />

        {/* ქვედა პანელი: იკონები და ღილაკი */}
        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-3 text-stone-400">
            <button
              type="button"
              className="hover:bg-stone-800 p-1.5 rounded-full transition-colors"
            >
              <Smile size={20} />
            </button>
            <button
              type="button"
              className="hover:bg-stone-800 p-1.5 rounded-full transition-colors"
            >
              <ImageIcon size={20} />
            </button>
          </div>

          {/* Comment ღილაკი - ჩნდება მხოლოდ მაშინ, როცა ტექსტი წერია */}
          {content.trim() && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "px-4 py-1.5 bg-[#4B96D8] hover:bg-[#3b7db5] text-white text-[14px] font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                isSubmitting && "animate-pulse",
              )}
            >
              {isSubmitting ? "..." : "Comment"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
