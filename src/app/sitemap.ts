import type { MetadataRoute } from "next";
import { listings } from "@/data/listings";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-14T00:00:00+08:00");
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/listing", priority: 0.9, changeFrequency: "weekly" },
    ...listings.map((l) => ({ path: `/listing/${l.slug}`, priority: 0.9, changeFrequency: "weekly" as const })),
    { path: "/simulasi-kpr", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kontak", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kebijakan-privasi", priority: 0.3, changeFrequency: "monthly" },
    { path: "/syarat-ketentuan", priority: 0.3, changeFrequency: "monthly" },
  ];
  return routes.map((r) => ({ url: `${SITE_URL}${r.path}`, lastModified, changeFrequency: r.changeFrequency, priority: r.priority }));
}
