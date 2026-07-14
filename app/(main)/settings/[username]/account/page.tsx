import { notFound } from "next/navigation";
import { usersServerService } from "@/services/user.server.service";
import AccountSettingsPage from "../AccountPage";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: Props) {
  const { username } = await params;

  const user = await usersServerService.getByUsername(username);

  if (!user) notFound();

  return <AccountSettingsPage user={user} />;
}
