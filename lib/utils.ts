import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildCommentTree(flatComments: any[]) {
  const map = new Map();
  const roots: any[] = [];

  // 1. შევქმნათ Map სწრაფი წვდომისთვის
  flatComments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  // 2. დავაკავშიროთ შვილები მშობლებთან
  flatComments.forEach((comment) => {
    if (comment.parentId && map.has(comment.parentId)) {
      map.get(comment.parentId).replies.push(map.get(comment.id));
    } else if (!comment.parentId) {
      roots.push(map.get(comment.id));
    }
  });

  return roots;
}
