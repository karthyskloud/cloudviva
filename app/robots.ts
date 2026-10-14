import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://cloudviva.com.au/sitemap.xml",
    host: "https://cloudviva.com.au",
  };
}
