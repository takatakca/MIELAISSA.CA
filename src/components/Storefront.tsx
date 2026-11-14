"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products, money, type Product } from "@/lib/catalogue";
import { categories, site, type Locale } from "@/lib/site";

type Selection = { slug: string; quantity: number };
function Art({
  kind = "jar",
  tone = 0,
  hero = false,
}: {
  kind?: string;
  tone?: number;
  hero?: boolean;
}) {
  return (
    <div
      className={`art tone-${tone} ${hero ? "hero-art" : ""}`}
      aria-hidden="true"
    >
      <div className="art-halo" />
      {kind === "jar" ? (
        <>
          <div className="honey-arc" />
          <div className="jar">
            <div className="lid" />
            <div className="glass-light" />
            <div className="jar-label">
              <span className="label-bee">✧</span>
              <b>
                MIEL
                <br />
                AISSA
              </b>
              <span>COLLECTION MIEL</span>
              <i>La douceur, naturellement.</i>
            </div>
            <div className="jar-base" />
          </div>
          <div className="honey-spoon">
            <i />
            <i />
            <i />
            <i />
          </div>
        </>
      ) : kind === "bottle" ? (
        <div className="bottle">
          <div className="dropper" />
          <div className="bottle-label">
            Miel Aissa<small>COLLECTION HUILES</small>
          </div>
        </div>
      ) : (
        <div className="candle">
          <div className="flame" />
          <div className="candle-label">
            Miel Aissa<small>MAISON</small>
          </div>
        </div>
      )}
      <div className="art-shadow" />
    </div>
  );
}
function Arrow() {
  return (
    <svg
      className="arrow-icon"
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
function Card({
  p,
  index,
  l,
  choose,
}: {
  p: Product;
  index: number;
  l: Locale;
  choose: (p: Product) => void;
}) {
  const t = (a: string, b: string) => (l === "fr" ? a : b);
  const href = (s: string) => `/${l}/${s}`;
  return (
    <article className="product-card">
      <Link className="product-picture" href={href("product/" + p.slug)}>
        <span className="product-index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Art kind={p.illustration} tone={p.tone} />
        <span className="illustration-note">
          {t("Illustration de collection", "Collection illustration")}
        </span>
        <span className="picture-arrow">
          <Arrow />
        </span>
      </Link>
      <div className="product-meta">
        <span>{categories.find((c) => c.id === p.category)?.[l]}</span>
        <button
          className="add"
          onClick={() => choose(p)}
          aria-label={t("Ajouter ", "Add ") + p[l]}
        >
          +
        </button>
      </div>
      <h3>
        <Link href={href("product/" + p.slug)}>{p[l]}</Link>
      </h3>
      <p className="price">
        {p.priceMin === p.priceMax ? "" : t("De ", "From ")}
        {money(p.priceMin, l)}
        {p.priceMin !== p.priceMax ? " – " + money(p.priceMax, l) : ""}
      </p>
    </article>
  );
}
export default function Storefront({
  locale: l,
  page,
}: {
  locale: Locale;
  page: string;
}) {
  const fr = l === "fr";
  const t = (a: string, b: string) => (fr ? a : b);
  const href = (s = "") => `/${l}${s ? "/" + s : ""}`;
  const [menu, setMenu] = useState(false),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [sort, setSort] = useState("featured"),
    [selection, setSelection] = useState<Selection[]>([]),
    [loaded, setLoaded] = useState(false),
    [consent, setConsent] = useState<boolean | null>(null),
    [message, setMessage] = useState("");
  const bag = useRef<HTMLDialogElement>(null);
  const preferences = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    document.documentElement.lang = fr ? "fr" : "en";
    try {
      const raw = JSON.parse(
        localStorage.getItem("mielaissa-selection") || "[]",
      );
      if (Array.isArray(raw))
        setSelection(
          raw
            .filter(
              (x) =>
                products.some((p) => p.slug === x.slug) &&
                Number.isInteger(x.quantity) &&
                x.quantity > 0 &&
                x.quantity <= 20,
            )
            .slice(0, 40),
        );
      const c = JSON.parse(localStorage.getItem("mielaissa-consent") || "null");
      if (
        c?.version === "2026-10-30" &&
        Date.now() - c.at < 15552000000 &&
        typeof c.optional === "boolean"
      )
        setConsent(c.optional);
    } catch {}
    setLoaded(true);
  }, [fr]);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem("mielaissa-selection", JSON.stringify(selection));
      } catch {}
  }, [selection, loaded]);
  function choose(p: Product) {
    setSelection((s) =>
      s.some((x) => x.slug === p.slug)
        ? s.map((x) =>
            x.slug === p.slug
              ? { ...x, quantity: Math.min(20, x.quantity + 1) }
              : x,
          )
        : [...s, { slug: p.slug, quantity: 1 }],
    );
    setMessage(t("Ajouté à votre sélection.", "Added to your selection."));
    bag.current?.showModal();
  }
  function saveConsent(optional: boolean) {
    try {
      localStorage.setItem(
        "mielaissa-consent",
        JSON.stringify({ version: "2026-10-30", at: Date.now(), optional }),
      );
    } catch {}
    setConsent(optional);
    preferences.current?.close();
  }
  const current = products.find((x) => page === "product/" + x.slug);
  const forced =
    page === "honeys"
      ? "honey"
      : page === "care"
        ? "care"
        : page === "groceries"
          ? "grocery"
          : page === "maison"
            ? "home"
            : null;
  const filtered = products
    .filter(
      (p) =>
        (forced || category) === "all" || p.category === (forced || category),
    )
    .filter((p) =>
      (p.fr + " " + p.en)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          query
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
        ),
    )
    .sort((a, b) =>
      sort === "az"
        ? a[l].localeCompare(b[l])
        : sort === "price"
          ? a.priceMin - b.priceMin
          : 0,
    );
  const business = [
    "business",
    "corporate-gifts",
    "restaurant",
    "point-of-sale",
  ].includes(page);
  const catalog = ["shop", "honeys", "care", "groceries", "maison"].includes(
    page,
  );
  const selectionText = selection
    .map(
      (x) => `${products.find((p) => p.slug === x.slug)?.[l]} × ${x.quantity}`,
    )
    .join("\n");

  return (
    <>
      <a className="skip" href="#main">
        {t("Aller au contenu", "Skip to content")}
      </a>
      <div className="announcement">
        <span>
          {t("Miel Aissa · Montréal, Québec", "Miel Aissa · Montréal, Québec")}
        </span>
        <Link href={href("contact")}>
          {t("Une question ? Parlons-en", "Have a question? Get in touch")}{" "}
          <Arrow />
        </Link>
      </div>
      <header>
        <div className="header-main">
          <Link
            className="wordmark"
            href={href()}
            aria-label="Miel Aissa accueil"
          >
            <span className="bee">✧</span>
            <span>
              miel<span className="brand-serif">aissa</span>
              <small>UNE TOUCHE DE DOUCEUR</small>
            </span>
          </Link>
          <nav
            aria-label={t("Navigation principale", "Main navigation")}
            className={menu ? "open" : ""}
          >
            <Link href={href("shop")} onClick={() => setMenu(false)}>
              {t("La boutique", "The shop")}
            </Link>
            <Link href={href("honeys")} onClick={() => setMenu(false)}>
              {t("Nos miels", "Our honeys")}
            </Link>
            <Link href={href("business")} onClick={() => setMenu(false)}>
              {t("Pour les entreprises", "For businesses")}
            </Link>
            <Link href={href("contact")} onClick={() => setMenu(false)}>
              Contact
            </Link>
          </nav>
          <div className="header-actions">
            <Link
              className="locale"
              href={`/${fr ? "en" : "fr"}${page ? "/" + page : ""}`}
              aria-label={fr ? "Switch to English" : "Passer en français"}
            >
              {fr ? "EN" : "FR"}
            </Link>
            <button
              className="bag-button"
              onClick={() => bag.current?.showModal()}
              aria-label={t("Ouvrir ma sélection", "Open my selection")}
            >
              ▱ <span>{selection.reduce((n, x) => n + x.quantity, 0)}</span>
            </button>
            <button
              className="menu-button"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={t("Menu principal", "Main menu")}
            >
              {menu ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        {!page && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">
                  <span />{" "}
                  {t(
                    "LES BELLES CHOSES, SIMPLEMENT.",
                    "THE GOOD THINGS, SIMPLY.",
                  )}
                </p>
                <h1>
                  {t("La douceur,", "Sweetness,")}
                  <br />
                  <em>{t("naturellement.", "naturally.")}</em>
                </h1>
                <p className="hero-intro">
                  {t(
                    "Des miels de caractère. Des découvertes gourmandes. Et cette petite touche qui change le quotidien. Bienvenue chez Miel Aissa.",
                    "Distinctive honeys. Delicious discoveries. And that little touch that transforms the everyday. Welcome to Miel Aissa.",
                  )}
                </p>
                <div className="hero-ctas">
                  <Link className="button" href={href("honeys")}>
                    {t("Découvrir nos miels", "Explore our honeys")} <Arrow />
                  </Link>
                  <Link className="text-link" href={href("shop")}>
                    {t("Toute la collection", "The whole collection")} →
                  </Link>
                </div>
                <div className="hero-bottom">
                  <span className="mini-seal">
                    M<span>✧</span>A
                  </span>
                  <p>
                    {t(
                      "À savourer. À partager. À offrir.",
                      "To savour. To share. To give.",
                    )}
                    <small>
                      {t(
                        "Votre boutique à Saint-Léonard, Montréal.",
                        "Your shop in Saint-Léonard, Montréal.",
                      )}
                    </small>
                  </p>
                </div>
              </div>
              <div className="hero-visual">
                <span className="visual-top">LA COLLECTION / 01</span>
                <Art hero />
                <span className="orbit-text">MIEL AISSA · MONTRÉAL ·</span>
                <div className="visual-bottom">
                  <span>
                    {t("Un univers de douceur", "A world of sweetness")}
                    <small>
                      {t(
                        "Illustration de collection",
                        "Collection illustration",
                      )}
                    </small>
                  </span>
                  <Link
                    href={href("honeys")}
                    aria-label={t("Explorer les miels", "Explore honeys")}
                  >
                    ↗
                  </Link>
                </div>
              </div>
            </section>
            <div className="marquee" aria-hidden="true">
              <span>MIELS DE CARACTÈRE</span>
              <i>✧</i>
              <span>LES PETITS PLAISIRS</span>
              <i>✧</i>
              <span>LE GOÛT DU PARTAGE</span>
              <i>✧</i>
              <span>MIEL AISSA</span>
            </div>
            <section className="collection section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    01 / {t("À DÉCOUVRIR", "TO DISCOVER")}
                  </p>
                  <h2>{t("Un monde à savourer.", "A world to savour.")}</h2>
                </div>
                <Link className="text-link" href={href("shop")}>
                  {t("Explorer la boutique", "Explore the shop")} <Arrow />
                </Link>
              </div>
              <div className="category-grid">
                {categories.map((c, i) => (
                  <Link
                    key={c.id}
                    href={href(["honeys", "care", "groceries", "maison"][i])}
                    className={"category-tile category-" + i}
                  >
                    <span>0{i + 1} /</span>
                    <h3>{c[l]}</h3>
                    <p>{fr ? c.detailFr : c.detailEn}</p>
                    <b>↗</b>
                  </Link>
                ))}
              </div>
            </section>
            <section className="section featured">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    02 / {t("LA COLLECTION MIEL", "THE HONEY COLLECTION")}
                  </p>
                  <h2>{t("À chacun sa douceur.", "Find your sweetness.")}</h2>
                </div>
                <Link className="text-link" href={href("honeys")}>
                  {t("Tous les miels", "All honeys")} <Arrow />
                </Link>
              </div>
              <div className="product-grid">
                {products.slice(0, 4).map((p, i) => (
                  <Card p={p} index={i} key={p.slug} l={l} choose={choose} />
                ))}
              </div>
              <p className="catalogue-note">
                {t(
                  "Prix relevés sur la boutique existante. Formats, disponibilité et prix définitif à confirmer avant commande.",
                  "Prices observed on the existing shop. Sizes, availability and final pricing must be confirmed before ordering.",
                )}
              </p>
            </section>
            <section className="story">
              <div className="story-art">
                <Art tone={2} />
                <span className="story-caption">
                  LES PETITS PLAISIRS FONT LES GRANDS MOMENTS.
                </span>
              </div>
              <div className="story-copy">
                <p className="eyebrow">L’ESPRIT MIEL AISSA</p>
                <h2>
                  {t("Le goût des choses", "A taste for")}
                  <br />
                  <em>{t("qui comptent.", "what matters.")}</em>
                </h2>
                <p>
                  {t(
                    "Miels, huiles, épicerie et créations pour la maison : une collection à découvrir à votre rythme. Pour votre table, vos rituels ou le plaisir d’offrir.",
                    "Honeys, oils, groceries and creations for the home: a collection to discover at your own pace. For your table, your rituals or the joy of giving.",
                  )}
                </p>
                <Link className="text-link" href={href("shop")}>
                  {t("Entrer dans notre univers", "Step into our world")}{" "}
                  <Arrow />
                </Link>
              </div>
            </section>
            <section className="section business-teaser">
              <p className="eyebrow">
                {t("LE PLAISIR D’OFFRIR", "THE JOY OF GIVING")}
              </p>
              <h2>
                {t("Une attention qui", "A thoughtful touch")}
                <br />
                <em>
                  {t("fait toute la différence.", "that makes a difference.")}
                </em>
              </h2>
              <p>
                {t(
                  "Cadeaux d’entreprise, restaurants, points de vente : parlons de votre projet.",
                  "Corporate gifts, restaurants, retail partners: let’s talk about your project.",
                )}
              </p>
              <Link className="button" href={href("business")}>
                {t(
                  "Créons quelque chose ensemble",
                  "Let’s create something together",
                )}{" "}
                <Arrow />
              </Link>
            </section>
          </>
        )}
        {catalog && (
          <section className="section catalogue">
            <p className="eyebrow">
              {t("LA BOUTIQUE / MIEL AISSA", "THE SHOP / MIEL AISSA")}
            </p>
            <h1>
              {forced
                ? categories.find((c) => c.id === forced)?.[l]
                : t("Les petits plaisirs.", "Small pleasures.")}
            </h1>
            <p className="lead">
              {t(
                "Explorez notre collection, trouvez votre douceur.",
                "Explore the collection. Find your sweetness.",
              )}
            </p>
            <div className="catalogue-toolbar">
              <label className="search">
                <span>⌕</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t(
                    "Rechercher une saveur, un produit…",
                    "Search a flavour, a product…",
                  )}
                  aria-label={t("Rechercher un produit", "Search products")}
                />
              </label>
              <label className="sort">
                {t("Trier", "Sort")}{" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="featured">
                    {t("Collection", "Collection")}
                  </option>
                  <option value="az">A — Z</option>
                  <option value="price">
                    {t("Prix croissant", "Price ascending")}
                  </option>
                </select>
              </label>
            </div>
            {!forced && (
              <div
                className="filter-tabs"
                aria-label={t("Catégories", "Categories")}
              >
                {[{ id: "all", fr: "Tout", en: "All" }, ...categories].map(
                  (c) => (
                    <button
                      aria-pressed={category === c.id}
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                    >
                      {c[l]}
                    </button>
                  ),
                )}
              </div>
            )}
            <div className="results-count" aria-live="polite">
              {filtered.length} {t("découvertes", "discoveries")}
            </div>
            <div className="product-grid">
              {filtered.map((p, i) => (
                <Card p={p} index={i} key={p.slug} l={l} choose={choose} />
              ))}
            </div>
            {!filtered.length && (
              <div className="empty">
                <h2>
                  {t(
                    "La collection se prépare.",
                    "The collection is coming together.",
                  )}
                </h2>
                <p>
                  {t(
                    "Contactez-nous pour connaître les produits disponibles.",
                    "Contact us to find out which products are available.",
                  )}
                </p>
                <Link href={href("contact")} className="button">
                  Contact <Arrow />
                </Link>
              </div>
            )}
            <p className="catalogue-note">
              {t(
                "Catalogue relevé sur le site existant, sans confirmation de stock en temps réel. Le paiement reste fermé pendant la migration.",
                "Catalogue observed on the existing site, without real-time stock confirmation. Payment remains closed during migration.",
              )}
            </p>
          </section>
        )}
        {current && (
          <section className="section product-detail">
            <Link className="back" href={href("shop")}>
              ← {t("La boutique", "The shop")}
            </Link>
            <div className="detail-grid">
              <div className="detail-art">
                <Art kind={current.illustration} tone={current.tone} />
                <small>
                  {t(
                    "Illustration de collection · visuel produit original à intégrer",
                    "Collection illustration · original product photograph pending",
                  )}
                </small>
              </div>
              <div className="detail-copy">
                <p className="eyebrow">
                  MIEL AISSA /{" "}
                  {categories.find((c) => c.id === current.category)?.[l]}
                </p>
                <h1>{current[l]}</h1>
                <p className="detail-price">
                  {money(current.priceMin, l)}
                  {current.priceMax !== current.priceMin
                    ? " — " + money(current.priceMax, l)
                    : ""}
                </p>
                <p>
                  {t(
                    "Retrouvez cette référence de la collection Miel Aissa. Contactez notre équipe pour choisir le format adapté et confirmer la disponibilité.",
                    "Discover this reference from the Miel Aissa collection. Contact our team to choose your size and confirm availability.",
                  )}
                </p>
                <div className="detail-notice">
                  {t(
                    "Formats et stock à confirmer. Cette sélection ne constitue pas une commande payée.",
                    "Sizes and stock to be confirmed. This selection is not a paid order.",
                  )}
                </div>
                <button className="button" onClick={() => choose(current)}>
                  {t("Ajouter à ma sélection", "Add to my selection")} +
                </button>
                <a
                  className="text-link"
                  href={`mailto:${site.email}?subject=${encodeURIComponent(current[l])}`}
                >
                  {t(
                    "Poser une question sur ce produit",
                    "Ask about this product",
                  )}{" "}
                  <Arrow />
                </a>
                <details>
                  <summary>
                    {t("Commande & livraison", "Ordering & delivery")}
                  </summary>
                  <p>
                    {t(
                      "Notre équipe confirme les formats, les frais de livraison, les taxes et les promotions applicables avant toute commande.",
                      "Our team confirms sizes, shipping fees, taxes and applicable promotions before you order.",
                    )}
                  </p>
                </details>
              </div>
            </div>
          </section>
        )}
        {business && (
          <section className="section business-page">
            <p className="eyebrow">
              MIEL AISSA / {t("PROFESSIONNELS", "PROFESSIONALS")}
            </p>
            <h1>
              {t("De belles idées.", "Great ideas.")}
              <br />
              <em>{t("À partager.", "Made to share.")}</em>
            </h1>
            <p className="lead">
              {t(
                "Cadeaux d’entreprise, restauration ou point de vente : donnons une saveur particulière à votre projet.",
                "Corporate gifting, hospitality or retail: bring a distinctive flavour to your project.",
              )}
            </p>
            <div className="business-grid">
              {[
                [
                  t("Cadeaux d’entreprise", "Corporate gifts"),
                  t(
                    "Une attention pour vos équipes, vos partenaires ou vos événements.",
                    "A thoughtful gift for your team, partners or events.",
                  ),
                ],
                [
                  t("Restaurants", "Restaurants"),
                  t(
                    "Parlons de vos besoins, des références et des formats.",
                    "Let’s discuss your needs, product selection and sizes.",
                  ),
                ],
                [
                  t("Points de vente", "Retail partners"),
                  t(
                    "Vous souhaitez proposer Miel Aissa dans votre boutique ? Rencontrons-nous.",
                    "Want to offer Miel Aissa in your shop? Let’s meet.",
                  ),
                ],
              ].map(([title, body], i) => (
                <article key={title}>
                  <span>0{i + 1}</span>
                  <h2>{title}</h2>
                  <p>{body}</p>
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent(title + " — Miel Aissa")}`}
                    className="text-link"
                  >
                    {t("Parlons de votre projet", "Talk about your project")}{" "}
                    <Arrow />
                  </a>
                </article>
              ))}
            </div>
            <div className="contact-strip">
              <span>
                {t("Un besoin précis ?", "Something specific in mind?")}
              </span>
              <a href={"tel:" + site.tel}>{site.phone} ↗</a>
            </div>
          </section>
        )}
        {page === "contact" && (
          <section className="section contact-page">
            <p className="eyebrow">{t("ON VOUS ÉCOUTE", "WE’RE LISTENING")}</p>
            <h1>
              {t("Un petit mot,", "A little note,")}
              <br />
              <em>{t("un grand plaisir.", "a great pleasure.")}</em>
            </h1>
            <div className="contact-grid">
              <div>
                <h2>{t("Retrouvons-nous.", "Let’s connect.")}</h2>
                <address>{site.address}</address>
                <a href={"tel:" + site.tel}>{site.phone}</a>
                <a href={"mailto:" + site.email}>{site.email}</a>
                <a
                  className="text-link"
                  href={
                    "https://www.google.com/maps/search/?api=1&query=" +
                    encodeURIComponent(site.address)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Voir l’itinéraire", "Get directions")} <Arrow />
                </a>
              </div>
              <div className="contact-card">
                <h2>{t("Comment peut-on vous aider ?", "How can we help?")}</h2>
                <p>
                  {t(
                    "Un produit, un cadeau ou un projet d’entreprise ? Écrivez-nous en précisant votre demande.",
                    "A product, a gift or a business project? Send us a note about what you need.",
                  )}
                </p>
                <a
                  className="button"
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Contact — Miel Aissa")}`}
                >
                  {t("Ouvrir mon courriel", "Open my email app")} <Arrow />
                </a>
                <small>
                  {t(
                    "Votre application de courriel s’ouvrira. Rien n’est envoyé automatiquement.",
                    "Your email app will open. Nothing is sent automatically.",
                  )}
                </small>
              </div>
            </div>
          </section>
        )}
        {page === "offers" && (
          <section className="section prose">
            <p className="eyebrow">
              {t(
                "OFFRES / INFORMATIONS À REVALIDER",
                "OFFERS / SUBJECT TO VALIDATION",
              )}
            </p>
            <h1>{t("Les petites attentions.", "Thoughtful little extras.")}</h1>
            <p>
              {t(
                "Les offres suivantes figuraient sur le site existant. Leur validité sera contrôlée avant toute commande, sans remise automatique dans cet aperçu.",
                "These offers appeared on the existing site. Eligibility will be checked before any order; no discount is automatically applied in this preview.",
              )}
            </p>
            <h2>MIELAISSA120</h2>
            <p>
              {t(
                "Livraison au Québec sur achat admissible de 120 $ CA ou plus avant taxes, hors régions éloignées. Un coupon par commande.",
                "Shipping in Québec on eligible purchases of CA$120 or more before taxes, excluding remote regions. One coupon per order.",
              )}
            </p>
            <h2>FIRSTORDER15</h2>
            <p>
              {t(
                "15 % sur une première commande admissible, une utilisation par nouveau client connecté.",
                "15% on an eligible first order, once per new signed-in customer.",
              )}
            </p>
            <h2>{t("Entreprises & étudiants", "Businesses & students")}</h2>
            <p>
              {t(
                "Offre de 15 % sous réserve de vérification du statut et des conditions commerciales.",
                "15% offer subject to status verification and commercial terms.",
              )}
            </p>
          </section>
        )}
        {["account", "games"].includes(page) && (
          <section className="section prose">
            <p className="eyebrow">MIEL AISSA / TAKATAK</p>
            <h1>
              {page === "games"
                ? t("Vos moments de jeu.", "Your playful moments.")
                : t("Votre espace, bientôt.", "Your space, coming soon.")}
            </h1>
            <p>
              {t(
                "Les comptes existants, l’historique de commandes et les points fidélité doivent être repris et vérifiés avant l’ouverture de ce nouvel espace. Aucun solde n’est inventé et aucun nouveau compte n’est créé ici.",
                "Existing accounts, order history and loyalty points must be migrated and verified before this new area opens. No balances are invented and no new account is created here.",
              )}
            </p>
            <Link className="button" href={href("contact")}>
              {t("Nous joindre", "Contact us")} <Arrow />
            </Link>
          </section>
        )}
        {page === "privacy" && (
          <section className="section prose">
            <p className="eyebrow">
              MIEL AISSA / {t("CONFIDENTIALITÉ", "PRIVACY")}
            </p>
            <h1>{t("Vos choix comptent.", "Your choices matter.")}</h1>
            <h2>{t("Cet aperçu", "This preview")}</h2>
            <p>
              {t(
                "Aucun pixel publicitaire, outil statistique ou widget tiers ne se charge dans cette version. Votre sélection de produits et votre choix de témoins sont conservés dans votre navigateur seulement.",
                "No advertising pixel, analytics tool or third-party widget loads in this version. Your product selection and cookie preference are stored only in your browser.",
              )}
            </p>
            <h2>{t("Vos renseignements", "Your information")}</h2>
            <p>
              {t(
                "Cliquer sur un lien de courriel ouvre votre propre application. Les renseignements que vous choisissez d’envoyer sont destinés à Miel Aissa pour répondre à votre demande. Une demande de renseignements ne vaut pas inscription à une infolettre.",
                "An email link opens your own email application. Information you choose to send goes to Miel Aissa to answer your request. Asking a question does not subscribe you to a newsletter.",
              )}
            </p>
            <h2>{t("Durée et contrôle", "Retention and control")}</h2>
            <p>
              {t(
                "Le choix de consentement expire après 180 jours. Vous pouvez le changer ci-dessous. La sélection est conservée jusqu’à son effacement dans le panier ou dans les données de votre navigateur. La politique commerciale complète sera validée avant la mise en service transactionnelle.",
                "Consent preferences expire after 180 days. You can change them below. Your selection stays until you clear it in the bag or your browser data. The full commercial policy will be validated before transactional launch.",
              )}
            </p>
            <button
              className="button"
              onClick={() => preferences.current?.showModal()}
            >
              {t("Modifier mes choix", "Change my choices")}
            </button>
            <p>
              Contact : <a href={"mailto:" + site.email}>{site.email}</a>
            </p>
          </section>
        )}
      </main>
      <footer>
        <div className="footer-top">
          <Link className="wordmark" href={href()}>
            <span className="bee">✧</span>
            <span>
              miel<span className="brand-serif">aissa</span>
              <small>LA DOUCEUR, NATURELLEMENT.</small>
            </span>
          </Link>
          <p>
            {t("Les petites choses.", "The little things.")}
            <br />
            <em>{t("Les grands plaisirs.", "The great pleasures.")}</em>
          </p>
        </div>
        <div className="footer-grid">
          <div>
            <h3>{t("Venez nous voir", "Come see us")}</h3>
            <address>{site.address}</address>
            <a href={"tel:" + site.tel}>{site.phone}</a>
            <a href={"mailto:" + site.email}>{site.email}</a>
          </div>
          <div>
            <h3>{t("La collection", "The collection")}</h3>
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={href(["honeys", "care", "groceries", "maison"][i])}
              >
                {c[l]}
              </Link>
            ))}
          </div>
          <div>
            <h3>{t("Entre nous", "Between us")}</h3>
            <Link href={href("business")}>{t("Entreprises", "Business")}</Link>
            <Link href={href("offers")}>
              {t("Offres & conditions", "Offers & conditions")}
            </Link>
            <Link href={href("contact")}>Contact</Link>
            <Link href={href("account")}>{t("Mon espace", "My account")}</Link>
          </div>
          <div>
            <h3>{t("Gardons le contact", "Let’s stay in touch")}</h3>
            <p>
              {t(
                "Vous souhaitez recevoir nos nouvelles ? Faites-nous-en la demande par courriel.",
                "Want to hear our news? Request it by email.",
              )}
            </p>
            <a
              className="footer-mail"
              href={`mailto:${site.email}?subject=${encodeURIComponent(t("Demande d’inscription à l’infolettre", "Newsletter subscription request"))}`}
            >
              {t("Demander les nouvelles", "Request updates")} ↗
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Miel Aissa ·{" "}
            {t("Une réalisation TAKATAK", "Crafted by TAKATAK")}
          </span>
          <Link href={href("privacy")}>{t("Confidentialité", "Privacy")}</Link>
          <button onClick={() => preferences.current?.showModal()}>
            {t("Mes choix de témoins", "Cookie choices")}
          </button>
        </div>
      </footer>
      <dialog ref={bag} className="bag-dialog">
        <form method="dialog">
          <button className="close-dialog" aria-label={t("Fermer", "Close")}>
            ✕
          </button>
        </form>
        <p className="eyebrow">MIEL AISSA</p>
        <h2>{t("Votre sélection.", "Your selection.")}</h2>
        <p className="bag-intro">
          {t(
            "Une première idée de vos envies. Notre équipe confirme les formats et les prix avant toute commande.",
            "A first look at your favourites. Our team confirms sizes and prices before any order.",
          )}
        </p>
        {selection.length ? (
          selection.map((x) => {
            const p = products.find((p) => p.slug === x.slug)!;
            return (
              <div className="bag-row" key={x.slug}>
                <div>
                  <b>{p[l]}</b>
                  <small>{t("Format à confirmer", "Size to confirm")}</small>
                </div>
                <label>
                  {t("Qté", "Qty")}
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={x.quantity}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isInteger(n) && n >= 1 && n <= 20)
                        setSelection((s) =>
                          s.map((y) =>
                            y.slug === x.slug ? { ...y, quantity: n } : y,
                          ),
                        );
                    }}
                  />
                </label>
                <button
                  onClick={() =>
                    setSelection((s) => s.filter((y) => y.slug !== x.slug))
                  }
                  aria-label={t("Retirer ", "Remove ") + p[l]}
                >
                  ×
                </button>
              </div>
            );
          })
        ) : (
          <p className="empty">
            {t(
              "Votre sélection attend ses premières découvertes.",
              "Your selection is waiting for its first discoveries.",
            )}
          </p>
        )}
        {selection.length > 0 && (
          <>
            <a
              className="button"
              href={`mailto:${site.email}?subject=${encodeURIComponent(t("Ma sélection Miel Aissa", "My Miel Aissa selection"))}&body=${encodeURIComponent(selectionText + "\n\n" + t("Merci de confirmer les formats, prix, taxes et livraison.", "Please confirm sizes, prices, taxes and delivery."))}`}
            >
              {t(
                "Demander une confirmation par courriel",
                "Request confirmation by email",
              )}{" "}
              <Arrow />
            </a>
            <button className="clear-bag" onClick={() => setSelection([])}>
              {t("Vider la sélection", "Clear selection")}
            </button>
          </>
        )}
        <small>
          {t(
            "Aucun paiement n’est prélevé. Aucun courriel n’est envoyé automatiquement.",
            "No payment is collected. No email is sent automatically.",
          )}
        </small>
      </dialog>
      <dialog ref={preferences} className="consent-dialog">
        <form method="dialog">
          <button className="close-dialog" aria-label={t("Fermer", "Close")}>
            ✕
          </button>
        </form>
        <p className="eyebrow">{t("VOTRE CONFIDENTIALITÉ", "YOUR PRIVACY")}</p>
        <h2>{t("À vous de choisir.", "You choose.")}</h2>
        <p>
          {t(
            "Seuls la sélection et vos choix sont mémorisés dans le navigateur. Aucun outil publicitaire ou statistique n’est actif. Les options facultatives resteront sans effet jusqu’à l’intégration validée des services.",
            "Only your selection and preferences are stored in your browser. No advertising or analytics tools are active. Optional choices have no effect until validated services are integrated.",
          )}
        </p>
        <div className="consent-actions">
          <button onClick={() => saveConsent(false)}>
            {t("Refuser le facultatif", "Reject optional")}
          </button>
          <button onClick={() => saveConsent(true)}>
            {t("Accepter le facultatif", "Accept optional")}
          </button>
        </div>
        <Link href={href("privacy")}>
          {t("Lire les détails", "Read details")}
        </Link>
      </dialog>
      {loaded && consent === null && (
        <aside
          className="consent-bar"
          aria-label={t("Choix des témoins", "Cookie choices")}
        >
          <div>
            <b>
              {t(
                "Un peu de douceur. Beaucoup de respect.",
                "A little sweetness. Plenty of respect.",
              )}
            </b>
            <p>
              {t(
                "Votre sélection reste dans votre navigateur. Aucun traceur facultatif actif.",
                "Your selection stays in your browser. No optional trackers are active.",
              )}
            </p>
          </div>
          <div className="consent-actions">
            <button onClick={() => saveConsent(false)}>
              {t("Refuser", "Reject")}
            </button>
            <button onClick={() => preferences.current?.showModal()}>
              {t("Personnaliser", "Customize")}
            </button>
            <button onClick={() => saveConsent(true)}>
              {t("Accepter", "Accept")}
            </button>
          </div>
        </aside>
      )}
      <span className="sr-only" role="status">
        {message}
      </span>
    </>
  );
}
