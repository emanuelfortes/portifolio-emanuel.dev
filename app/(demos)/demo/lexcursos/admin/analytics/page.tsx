import type { Metadata } from "next";
import { AdminAnalyticsPage } from "@/demos/lexcursos/pages/admin/analytics";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analytics" };

export default function Page() {
  return <AdminAnalyticsPage />;
}
