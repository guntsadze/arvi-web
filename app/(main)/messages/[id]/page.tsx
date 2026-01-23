import { Suspense } from "react";
import MessagesClient from "../MessagesClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagesClient initialActiveId={id} />
    </Suspense>
  );
}
