import { notFound } from "next/navigation";
import ProfilePage from "./ProfilePage";
import { usersServerService } from "@/services/user.server.service";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: Props) {
  const { username } = await params;

  const user = await usersServerService.getByUsername(username);

  if (!user) notFound();

  return <ProfilePage user={user} />;
}
