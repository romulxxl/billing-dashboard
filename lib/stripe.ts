import "server-only"; // Stripe secret key must never reach the browser
import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "sk_test_demo_placeholder");
