import { useForm } from "react-hook-form";
import { CornerDownRight } from "lucide-react";

interface CommentFormProps {
  onSubmit: (data: { content: string }) => void;
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  onSubmit,
  placeholder = "Append comment to log...",
  buttonText = "Exec",
  autoFocus = false,
}: CommentFormProps) {
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const submitHandler = (data: { content: string }) => {
    if (!data.content.trim()) return;
    onSubmit(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex gap-0 mb-8 border border-stone-700 bg-stone-900"
    >
      <div className="p-3 text-stone-600 border-r border-stone-700">
        <CornerDownRight size={16} />
      </div>
      <input
        {...register("content")}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-4 py-2 font-mono text-xs text-[#EBE9E1] placeholder:text-stone-600 focus:outline-none"
        autoFocus={autoFocus}
      />
      <button
        type="submit"
        className="px-4 text-[10px] font-black uppercase text-amber-600 hover:bg-amber-900/20 hover:text-amber-500 transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
}
