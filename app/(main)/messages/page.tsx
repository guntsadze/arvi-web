import { Suspense } from "react";
import MessagesClient from "./MessagesClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagesClient />
    </Suspense>
  );
}
