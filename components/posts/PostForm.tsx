"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as ImageIcon, Video, MapPin } from "lucide-react";
import { postsApi } from "@/services/posts-service";

interface PostFormProps {
  onPostCreated: () => void;
}

export function PostForm({ onPostCreated }: PostFormProps) {
  //   const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      await postsApi.createPost({ content });
      setContent("");
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar>
          {/* <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback> */}
        </Avatar>

        <div className="flex-1">
          <Textarea
            placeholder="რას ფიქრობ?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-0 focus-visible:ring-0"
          />

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ImageIcon size={20} className="mr-1" />
                ფოტო
              </Button>
              <Button variant="ghost" size="sm">
                <Video size={20} className="mr-1" />
                ვიდეო
              </Button>
              <Button variant="ghost" size="sm">
                <MapPin size={20} className="mr-1" />
                ლოკაცია
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
            >
              {loading ? "იგზავნება..." : "გამოქვეყნება"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
