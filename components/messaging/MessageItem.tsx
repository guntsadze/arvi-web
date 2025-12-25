import { Message } from "@/types/messaging.types";

interface MessageItemProps {
  message: Message;
  isMine: boolean;
}

export const MessageItem = ({ message, isMine }: MessageItemProps) => {
  return (
    <div
      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4 px-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isMine
            ? "bg-orange-500 text-white rounded-br-none"
            : "bg-neutral-800 text-neutral-100 rounded-bl-none"
        }`}
      >
        <div className="break-words whitespace-pre-wrap">{message.content}</div>
        <div
          className={`text-xs mt-1 ${
            isMine ? "text-orange-100" : "text-neutral-500"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
