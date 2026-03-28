import { useState } from "react";
import { LikeableServices, ServiceType } from "@/services/registry";

interface UseLikeProps {
  id: string;
  type: ServiceType; // აქ გადასცემ "cars" ან "posts"
  initialIsLiked: boolean;
  initialCount: number;
}

export function useLikeAction({
  id,
  type,
  initialIsLiked,
  initialCount,
}: UseLikeProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // დინამიურად ვირჩევთ სერვისს ტიპის მიხედვით
      const service = LikeableServices[type];

      // ვიძახებთ ლაიქის მეთოდს.
      // მნიშვნელოვანია: ყველა სერვისში ამ მეთოდს ერთი და იგივე სახელი (მაგ: like) ერქვას
      const res = await service.like(id);

      setIsLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error(`${type} like failed:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLiked, likesCount, handleLike, isLoading };
}
