interface TypingIndicatorProps {
  userName: string;
}

export const TypingIndicator = ({ userName }: TypingIndicatorProps) => {
  return (
    <div className="px-4 py-2 bg-surface-1/50 border-t border-border">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
        </div>
        <span className="text-sm text-text-secondary">{userName} წერს...</span>
      </div>
    </div>
  );
};
