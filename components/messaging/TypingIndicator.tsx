interface TypingIndicatorProps {
  userName: string;
}

export const TypingIndicator = ({ userName }: TypingIndicatorProps) => {
  return (
    <div className="px-4 py-2 bg-neutral-900/50 border-t border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
        </div>
        <span className="text-sm text-neutral-400">{userName} წერს...</span>
      </div>
    </div>
  );
};
