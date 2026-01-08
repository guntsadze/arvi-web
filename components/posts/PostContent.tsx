import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface PostContentProps {
  content: string;
  isEditing: boolean;
  onSave: (data: { content: string }) => Promise<void>;
  onCancel: () => void;
}

export function PostContent({
  content,
  isEditing,
  onSave,
  onCancel,
}: PostContentProps) {
  const { register, handleSubmit, reset, setFocus } = useForm<{
    content: string;
  }>({
    defaultValues: { content },
  });

  useEffect(() => {
    if (isEditing) {
      reset({ content });
      setFocus("content");
    }
  }, [isEditing, content, reset, setFocus]);

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit(onSave)}
        className="space-y-4 border border-amber-600/30 p-4 bg-stone-900/50"
      >
        <textarea
          {...register("content")}
          rows={5}
          className="w-full bg-transparent font-mono text-[#EBE9E1] text-sm resize-none focus:outline-none placeholder:text-stone-600"
        />
        <div className="flex justify-end gap-2 pt-2 border-t border-dashed border-stone-700">
          <button
            type="button"
            onClick={onCancel}
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
    );
  }

  return (
    <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-stone-300">
      {content}
    </p>
  );
}
