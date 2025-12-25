import { MessageCircle } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full bg-neutral-950">
      <div className="text-center">
        <MessageCircle className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-400 mb-2">
          აირჩიეთ საუბარი
        </h3>
        <p className="text-neutral-500">
          აირჩიეთ საუბარი მარცხნივ სიაში მესიჯების სანახავად
        </p>
      </div>
    </div>
  );
};
