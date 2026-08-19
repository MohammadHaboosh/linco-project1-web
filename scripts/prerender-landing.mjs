import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv } from "vite";
import { getLandingContent } from "../src/features/LandingPage/landingContent.js";

const projectRoot = process.cwd();
const clientDirectory = resolve(projectRoot, "dist");
const serverDirectory = resolve(projectRoot, ".prerender");
const baseHtmlPath = resolve(clientDirectory, "index.html");
const serverEntryPath = resolve(serverDirectory, "entry-server.js");
const env = loadEnv("production", projectRoot, "");
const rawSiteUrl = process.env.VITE_PUBLIC_SITE_URL || env.VITE_PUBLIC_SITE_URL;

if (!rawSiteUrl) {
  throw new Error(
    "VITE_PUBLIC_SITE_URL is required for production SEO output. Set it to the canonical public origin, for example https://www.example.com.",
  );
}

if (!existsSync(baseHtmlPath) || !existsSync(serverEntryPath)) {
  throw new Error("The client or server build required for prerendering is missing.");
}

const siteUrl = rawSiteUrl.replace(/\/$/, "");
const { renderLanding } = await import(pathToFileURL(serverEntryPath).href);
const baseHtml = readFileSync(baseHtmlPath, "utf8");

const escapeAttribute = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const getPageUrl = (locale) =>
  locale === "ar" ? `${siteUrl}/ar` : `${siteUrl}/`;

const buildHead = (locale) => {
  const content = getLandingContent(locale);
  const pageUrl = getPageUrl(locale);
  const ogLocale = locale === "ar" ? "ar_SY" : "en_US";
  const alternateOgLocale = locale === "ar" ? "en_US" : "ar_SY";
  const socialImage = `${siteUrl}/images/linco-social-card.jpg`;

  return `
    <title>${escapeAttribute(content.seo.title)}</title>
    <meta name="description" content="${escapeAttribute(content.seo.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="theme-color" content="#07172f" />
    <link rel="canonical" href="${pageUrl}" />
    <link rel="alternate" hreflang="en" href="${getPageUrl("en")}" />
    <link rel="alternate" hreflang="ar" href="${getPageUrl("ar")}" />
    <link rel="alternate" hreflang="x-default" href="${getPageUrl("en")}" />
    <link rel="preload" as="image" type="image/avif" href="/images/features-landing/feature-1.avif" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="LinCo" />
    <meta property="og:title" content="${escapeAttribute(content.seo.title)}" />
    <meta property="og:description" content="${escapeAttribute(content.seo.description)}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:locale" content="${ogLocale}" />
    <meta property="og:locale:alternate" content="${alternateOgLocale}" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="LinCo connected corporate learning demo" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(content.seo.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(content.seo.description)}" />
    <meta name="twitter:image" content="${socialImage}" />`;
};

const buildPage = (locale) => {
  const content = getLandingContent(locale);
  const appHtml = renderLanding(locale);
  const withoutDefaultHead = baseHtml
    .replace(/\s*<title>.*?<\/title>/is, "")
    .replace(/\s*<meta name="robots"[^>]*>/i, "")
    .replace(/\s*<meta name="theme-color"[^>]*>/i, "");

  return withoutDefaultHead
    .replace(
      /<html\s+lang="[^"]+"(?:\s+dir="[^"]+")?>/i,
      `<html lang="${content.locale}" dir="${content.direction}">`,
    )
    .replace("</head>", `${buildHead(locale)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
};

const fallbackHtml = baseHtml.includes('name="robots"')
  ? baseHtml
  : baseHtml.replace(
      "</head>",
      '<meta name="robots" content="noindex, nofollow" /></head>',
    );

writeFileSync(resolve(clientDirectory, "__spa-fallback.html"), fallbackHtml);
writeFileSync(baseHtmlPath, buildPage("en"));

const arabicDirectory = resolve(clientDirectory, "ar");
mkdirSync(arabicDirectory, { recursive: true });
writeFileSync(resolve(arabicDirectory, "index.html"), buildPage("ar"));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${siteUrl}/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="ar" href="${siteUrl}/ar" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>
  <url>
    <loc>${siteUrl}/ar</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="ar" href="${siteUrl}/ar" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const llms = `# LinCo

> LinCo is a corporate learning demo for courses, live sessions, department learning paths, collaboration, certificates, and progress analytics.

## Canonical public pages

- [LinCo in English](${siteUrl}/): Product overview, company outcomes, capabilities, workflows, solutions, and FAQs.
- [LinCo in Arabic](${siteUrl}/ar): Arabic version of the same public product information.

## Product facts

- Companies can organize employees into department learning spaces.
- LinCo supports company courses, shared courses, live sessions, practical tasks, collaboration, certificates, leaderboards, and progress analytics.
- The primary public conversion is account creation; company demo requests follow account creation.

## Contact

- Email: contact@linco.com
`;

writeFileSync(resolve(clientDirectory, "sitemap.xml"), sitemap);
writeFileSync(resolve(clientDirectory, "robots.txt"), robots);
writeFileSync(resolve(clientDirectory, "llms.txt"), llms);

if (dirname(serverDirectory) !== projectRoot) {
  throw new Error("Refusing to remove an unexpected prerender directory.");
}

rmSync(serverDirectory, { recursive: true, force: true });
