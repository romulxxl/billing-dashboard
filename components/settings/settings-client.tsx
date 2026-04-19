"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Trash2, LogOut } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getInitials } from "@/lib/utils";
import type { SessionUser } from "@/types";

interface SettingsClientProps {
  user: SessionUser;
  isDemo: boolean;
}

export function SettingsClient({ user, isDemo }: SettingsClientProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (isDemo) {
      setDeleteOpen(false);
      toast.warning("Cannot delete the demo account.");
      return;
    }
    setDeleting(true);
    // In a real app, call DELETE /api/account
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Account deleted.");
    signOut({ callbackUrl: "/" });
  }

  async function handleSignOut() {
    if (isDemo) {
      await fetch("/api/demo-logout", { method: "POST" });
      router.push("/");
      return;
    }
    signOut({ callbackUrl: "/" });
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your profile and account preferences.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            {isDemo
              ? "Demo account — pre-loaded with sample data."
              : "Your profile information from GitHub OAuth."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="h-16 w-16 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-xl font-bold text-violet-700">
                {getInitials(user.name)}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-100">{user.name}</p>
              <p className="text-sm text-slate-400">
                {isDemo ? "Demo account" : "Avatar synced from GitHub"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                defaultValue={user.name ?? ""}
                disabled
                className="max-w-sm"
              />
              <p className="text-xs text-slate-400">
                {isDemo ? "Read-only in demo mode." : "Managed by your GitHub profile."}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email ?? ""}
                disabled
                className="max-w-sm"
              />
              <p className="text-xs text-slate-400">
                {isDemo ? "Read-only in demo mode." : "Email is read-only for OAuth accounts."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize how information is displayed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency display</Label>
            <select
              id="currency"
              className="flex h-9 max-w-[160px] rounded-lg border border-slate-700 bg-navy-900/80 px-3 py-1 text-sm text-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="usd"
            >
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dateFormat">Date format</Label>
            <select
              id="dateFormat"
              className="flex h-9 max-w-[200px] rounded-lg border border-slate-700 bg-navy-900/80 px-3 py-1 text-sm text-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="mdy"
            >
              <option value="mdy">MM/DD/YYYY</option>
              <option value="dmy">DD/MM/YYYY</option>
              <option value="ymd">YYYY-MM-DD</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Sign out */}
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400">Danger zone</CardTitle>
          <CardDescription>
            Irreversible actions. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4 bg-slate-700" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-200">Delete account</p>
              <p className="text-sm text-slate-400">
                Permanently delete your account and all data.
              </p>
            </div>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDemo}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account, cancel your subscription, and remove all your
                    data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Yes, delete my account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
