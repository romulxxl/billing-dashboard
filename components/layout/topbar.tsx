"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, CreditCard, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { SynapseLogo } from "@/components/ui/synapse-logo";
import { getInitials } from "@/lib/utils";
import type { SessionUser } from "@/types";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface TopBarProps {
  user: SessionUser;
  isDemo?: boolean;
}

export function TopBar({ user, isDemo = false }: TopBarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header
        className="flex h-14 items-center justify-between px-4 lg:hidden"
        style={{
          background: "#040d1f",
          borderBottom: "1px solid rgba(22,48,96,0.5)",
        }}
      >
        <SynapseLogo />
        <div className="flex items-center gap-2">
          {isDemo && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.3)",
                color: "#fbbf24",
              }}
            >
              Demo
            </span>
          )}
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: "#475569" }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transition-transform duration-300 lg:hidden flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "#040d1f",
          borderRight: "1px solid rgba(22,48,96,0.5)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: "1px solid rgba(22,48,96,0.4)" }}
        >
          <SynapseLogo />
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 transition-colors"
            style={{ color: "#334155" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
                style={
                  isActive
                    ? {
                        background: "rgba(37,99,235,0.15)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        color: "#60a5fa",
                      }
                    : {
                        background: "transparent",
                        border: "1px solid transparent",
                        color: "#334155",
                      }
                }
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? "#3b82f6" : "#1e4080" }} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: "1px solid rgba(22,48,96,0.4)" }}>
          <div className="flex items-center gap-3">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name ?? ""} className="h-8 w-8 rounded-full" />
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "rgba(37,99,235,0.2)", color: "#60a5fa" }}
              >
                {getInitials(user.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs" style={{ color: "#334155" }}>{user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg p-1.5"
              style={{ color: "#334155" }}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
