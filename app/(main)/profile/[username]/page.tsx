import { usersService } from "@/services/user/user.service";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProfilePage from "./ProfilePage";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: Props) {
  const { username } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const user = await usersService.getByUsername(username, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!user) notFound();

  return <ProfilePage user={user} />;
}
