import { MessageCircle } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="text-center">
        <MessageCircle className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-text-secondary mb-2">
          აირჩიეთ საუბარი
        </h3>
        <p className="text-text-muted">
          აირჩიეთ საუბარი მარცხნივ სიაში მესიჯების სანახავად
        </p>
      </div>
    </div>
  );
};
