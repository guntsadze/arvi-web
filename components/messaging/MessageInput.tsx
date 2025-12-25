import { useState, FormEvent } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  onTyping: () => void;
  disabled?: boolean;
}

export const MessageInput = ({
  onSend,
  onTyping,
  disabled = false,
}: MessageInputProps) => {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSend(value);
      setValue("");
    } catch (error) {
      console.error("მესიჯის გაგზავნა ჩავარდა:", error);
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onTyping();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-neutral-800 bg-neutral-900"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled || sending}
          placeholder="დაწერეთ შეტყობინება..."
          className="flex-1 bg-neutral-800 text-white rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled || sending}
          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
