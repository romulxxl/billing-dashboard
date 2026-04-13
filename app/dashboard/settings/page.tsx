import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { SettingsClient } from "@/components/settings/settings-client";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <SettingsClient user={session.user} isDemo={session.isDemo} />;
}
