// სერვერ საიდი  ორივეზე შესაქმნელია საუკეთესო პრაქტიკებით თუ როგორ უნდა გამოვიყენო

// // app/dashboard/page.tsx
// import { api } from "@/lib/api";

// export default async function DashboardPage() {
//   const posts = await api.get("http://localhost:5013/users");
//   console.log(posts);

//   return <div>{JSON.stringify(posts)}</div>;
// }

//კლიენტის გამოყენებით
"use client";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";

export default function DashboardClient() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    apiClient
      .get("/users", { page: 1, pageSize: 20 })
      .then(setPosts)
      .catch(console.error);
  }, []);

  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
