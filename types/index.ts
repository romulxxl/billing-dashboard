import type { User, Subscription, Invoice } from "@prisma/client";

export type { User, Subscription, Invoice };

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface SubscriptionWithUser extends Subscription {
  user: User;
}

export interface DashboardStats {
  monthlySpend: number;
  activePlan: string | null;
  nextInvoiceDate: Date | null;
  nextInvoiceAmount: number;
  eventsThisMonth: number;
  eventsLimit: number;
  teamMembers: number;
  teamMembersLimit: number;
  projects: number;
  projectsLimit: number;
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Extend next-auth session types
declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}
