import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Storefront from "@/components/Storefront";
import { products } from "@/lib/catalogue";
import { site, type Locale } from "@/lib/site";
export const dynamic = "force-dynamic";
const pages = [
  "",
  "home",
  "shop",
  "honeys",
  "care",
  "groceries",
  "maison",
  "business",
  "corporate-gifts",
  "restaurant",
  "point-of-sale",
  "contact",
  "privacy",
  "offers",
  "account",
  "games",
];
async function resolve(params: Promise<{ path?: string[] }>) {
  const { path = [] } = await params;
  const locale: Locale = path[0] === "en" ? "en" : "fr";
  const parts = ["fr", "en"].includes(path[0]) ? path.slice(1) : path;
  const page = parts.join("/");
  if (
    !pages.includes(page) &&
    !products.some((x) => page === "product/" + x.slug)
  )
    notFound();
  return { locale, page: page === "home" ? "" : page };
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { locale, page } = await resolve(params);
  const product = products.find((x) => page === "product/" + x.slug);
  const name =
    product?.[locale] ||
    (locale === "fr" ? "La douceur, naturellement." : "Sweetness, naturally.");
  return {
    title: `${name} — Miel Aissa`,
    alternates: {
      canonical: `${site.domain}/${locale}/${page}`,
      languages: {
        "fr-CA": `${site.domain}/fr/${page}`,
        "en-CA": `${site.domain}/en/${page}`,
      },
    },
    openGraph: {
      title: `${name} — Miel Aissa`,
      type: "website",
      locale: locale === "fr" ? "fr_CA" : "en_CA",
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { locale, page } = await resolve(params);
  return <Storefront locale={locale} page={page} />;
}
