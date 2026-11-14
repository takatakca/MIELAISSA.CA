import type { Metadata } from "next";
import "../globals.css";
export const metadata: Metadata = {
  title: "Miel Aissa — La douceur, naturellement.",
  description:
    "Découvrez la collection Miel Aissa : miels, huiles, épicerie et maison. Montréal, Québec.",
  robots: {
    index: process.env.SITE_RELEASE_PUBLIC === "true",
    follow: process.env.SITE_RELEASE_PUBLIC === "true",
  },
};
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const language = path[0] === "en" ? "en" : "fr";
  return (
    <html lang={language}>
      <body>{children}</body>
    </html>
  );
}
