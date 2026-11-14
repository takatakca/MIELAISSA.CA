import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: process.env.SITE_RELEASE_PUBLIC === "true" ? "/" : undefined,
      disallow:
        process.env.SITE_RELEASE_PUBLIC === "true"
          ? ["/api/", "/fr/account", "/en/account"]
          : ["/"],
    },
  };
}
