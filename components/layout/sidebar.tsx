"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn, getInitials } from "@/lib/utils";
import { SynapseLogo } from "@/components/ui/synapse-logo";
import type { SessionUser } from "@/types";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  user: SessionUser;
  isDemo?: boolean;
}

export function Sidebar({ user, isDemo = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-64 flex-col"
      style={{
        background: "#040d1f",
        borderRight: "1px solid rgba(22,48,96,0.5)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5"
        style={{ borderBottom: "1px solid rgba(22,48,96,0.4)" }}
      >
        <SynapseLogo />
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
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
              )}
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
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.color = "#93c5fd";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.color = "#334155";
              }}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                style={{ color: isActive ? "#3b82f6" : "#1e4080" }}
              />
              {label}
              {isActive && (
                <span
                  className="ml-auto h-1.5 w-1.5 rounded-full"
                  style={{ background: "#3b82f6" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div
        className="p-4"
        style={{ borderTop: "1px solid rgba(22,48,96,0.4)" }}
      >
        <div className="flex items-center gap-3">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="h-8 w-8 rounded-full object-cover"
              style={{ outline: "2px solid rgba(37,99,235,0.3)", outlineOffset: "2px" }}
            />
          ) : (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "rgba(37,99,235,0.2)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}
            >
              {getInitials(user.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user.name ?? "User"}
            </p>
            <p className="truncate text-xs" style={{ color: "#334155" }}>
              {user.email ?? ""}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: "#334155" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#f87171")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#334155")
            }
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
