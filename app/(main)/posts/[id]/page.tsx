import { SinglePostView } from "@/components/posts/SinglePostView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <SinglePostView postId={id} />
      </div>
    </main>
  );
}
