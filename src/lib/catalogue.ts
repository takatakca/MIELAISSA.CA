import data from "../../content/catalogue.json";
export const products = data;
export type Product = (typeof products)[number];
export function money(cents: number, locale: "fr" | "en") {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);
}
