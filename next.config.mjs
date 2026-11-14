// Owner rejected this editorial prototype. It must not become the public release.
// Remove this hold only when the source-faithful replacement is implemented and verified.
if (process.env.SITE_RELEASE_PUBLIC === "true") {
  throw new Error("Public build blocked: source-faithful MIELAISSA conversion is incomplete; editorial prototype rejected by owner.");
}

const config = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'" +
              (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "") +
              "; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/ca-en/:path*", destination: "/en/:path*", permanent: true },
      { source: "/ca-fr/:path*", destination: "/fr/:path*", permanent: true },
      { source: "/en-ca/:path*", destination: "/en/:path*", permanent: true },
    ];
  },
};
export default config;
