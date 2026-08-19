import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoAnalyticsOutline,
  IoArrowForwardOutline,
  IoBookOutline,
  IoChatbubblesOutline,
  IoCheckmarkCircle,
  IoChevronDownOutline,
  IoCloseOutline,
  IoLayersOutline,
  IoMenuOutline,
  IoMoonOutline,
  IoPeopleOutline,
  IoRibbonOutline,
  IoSchoolOutline,
  IoSparklesOutline,
  IoSunnyOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { useTheme } from "../../hooks/useTheme.js";
import { PATHS } from "../../routes/paths";
import { getLandingContent } from "./landingContent";
import styles from "./LandingPage.module.css";

const FEATURE_ICONS = [
  IoSchoolOutline,
  IoChatbubblesOutline,
  IoSparklesOutline,
  IoBookOutline,
];

const OUTCOME_ICONS = [IoLayersOutline, IoPeopleOutline, IoAnalyticsOutline];

const SOLUTION_ICONS = [
  IoAnalyticsOutline,
  IoBookOutline,
  IoRibbonOutline,
  IoVideocamOutline,
];

const PUBLIC_SITE_URL = (
  import.meta.env.VITE_PUBLIC_SITE_URL || "https://linco.com"
).replace(/\/$/, "");

const revealDelay = (index, step = 90) => ({
  "--reveal-delay": `${index * step}ms`,
});

const ProductPreview = ({ item, variant = 0 }) => {
  const PreviewIcon = [IoSchoolOutline, IoChatbubblesOutline, IoAnalyticsOutline][
    variant
  ];

  return (
    <div
      className={styles.previewShell}
      role="img"
      aria-label={item.alt}
    >
      <aside className={styles.previewSidebar} aria-hidden="true">
        <span className={styles.previewLogo}>
          <PreviewIcon />
        </span>
        <span />
        <span />
        <span />
        <span />
      </aside>

      <div className={styles.previewWorkspace}>
        <div className={styles.previewToolbar}>
          <div>
            <span>{item.title}</span>
            <small>{item.description}</small>
          </div>
          <i aria-hidden="true" />
        </div>

        {variant === 0 && (
          <>
            <div className={styles.previewMetricGrid}>
              {item.bullets.map((bullet, index) => {
                const MetricIcon = [
                  IoBookOutline,
                  IoVideocamOutline,
                  IoAnalyticsOutline,
                ][index];

                return (
                  <div key={bullet}>
                    <span className={styles.previewMetricIcon}>
                      <MetricIcon aria-hidden="true" />
                    </span>
                    <strong>{bullet}</strong>
                    <i aria-hidden="true" />
                  </div>
                );
              })}
            </div>
            <div className={styles.previewCourseList}>
              {item.bullets.map((bullet, index) => (
                <div key={bullet}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{bullet}</strong>
                  <i style={{ "--preview-progress": `${72 - index * 14}%` }} />
                </div>
              ))}
            </div>
          </>
        )}

        {variant === 1 && (
          <div className={styles.previewChatLayout}>
            <div className={styles.previewChannels}>
              {item.bullets.map((bullet, index) => (
                <span
                  className={index === 0 ? styles.channelActive : ""}
                  key={bullet}
                >
                  <i aria-hidden="true" />
                  {bullet}
                </span>
              ))}
            </div>
            <div className={styles.previewMessages} aria-hidden="true">
              <div>
                <i />
                <span>
                  <b />
                  <b />
                </span>
              </div>
              <div>
                <i />
                <span>
                  <b />
                  <b />
                  <b />
                </span>
              </div>
              <div>
                <i />
                <span>
                  <b />
                  <b />
                </span>
              </div>
              <div className={styles.previewComposer}>
                <span />
                <i />
              </div>
            </div>
          </div>
        )}

        {variant === 2 && (
          <div className={styles.previewAnalyticsLayout}>
            <div className={styles.previewChart} aria-hidden="true">
              <span style={{ "--bar-height": "48%" }} />
              <span style={{ "--bar-height": "66%" }} />
              <span style={{ "--bar-height": "58%" }} />
              <span style={{ "--bar-height": "82%" }} />
              <span style={{ "--bar-height": "74%" }} />
              <span style={{ "--bar-height": "92%" }} />
            </div>
            <div className={styles.previewRecognition}>
              {item.bullets.map((bullet, index) => (
                <div key={bullet}>
                  <span>
                    {index === 1 ? (
                      <IoRibbonOutline />
                    ) : (
                      <IoCheckmarkCircle />
                    )}
                  </span>
                  <strong>{bullet}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionHeader = ({ eyebrow, title, description, id, align = "center" }) => (
  <div
    className={`${styles.sectionHeader} ${styles[align]}`}
    data-scroll-reveal="up"
  >
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h2 id={id}>{title}</h2>
    <p className={styles.sectionDescription}>{description}</p>
  </div>
);

const FAQItem = ({ item, isOpen, onToggle, buttonId, panelId }) => (
  <article className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}>
    <h3>
      <button
        type="button"
        id={buttonId}
        className={styles.faqButton}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{item.question}</span>
        <IoChevronDownOutline aria-hidden="true" />
      </button>
    </h3>
    <div
      id={panelId}
      role="region"
      aria-labelledby={buttonId}
      className={styles.faqPanel}
      hidden={!isOpen}
    >
      <p>{item.answer}</p>
    </div>
  </article>
);

const LandingPage = ({ locale = "en" }) => {
  const content = getLandingContent(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const landingRef = useRef(null);
  const { toggleTheme } = useTheme();
  const isArabic = content.locale === "ar";
  const localizedPath = isArabic ? "/ar" : "/";
  const alternatePath = isArabic ? "/" : "/ar";
  const canonicalUrl =
    localizedPath === "/"
      ? `${PUBLIC_SITE_URL}/`
      : `${PUBLIC_SITE_URL}${localizedPath}`;

  const structuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "LinCo",
        alternateName: "Link Company",
        url: `${PUBLIC_SITE_URL}/`,
        logo: `${PUBLIC_SITE_URL}/icons/linco-logo-96.webp`,
        email: "contact@linco.com",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "LinCo",
        url: canonicalUrl,
        inLanguage: content.locale,
        description: content.seo.description,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "LinCo",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        url: canonicalUrl,
        inLanguage: content.locale,
        description: content.seo.description,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: content.locale,
        mainEntity: content.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
    [canonicalUrl, content],
  );

  useEffect(() => {
    document.documentElement.lang = content.locale;
    document.documentElement.dir = content.direction;
    document.title = content.seo.title;
  }, [content]);

  useEffect(() => {
    const landingElement = landingRef.current;

    if (!landingElement) return undefined;

    const revealElements = Array.from(
      landingElement.querySelectorAll("[data-scroll-reveal]"),
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => {
        element.classList.add(styles.revealed);
      });
      return undefined;
    }

    landingElement.classList.add(styles.motionReady);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [content.locale]);

  return (
    <div
      ref={landingRef}
      className={styles.landing}
      lang={content.locale}
      dir={content.direction}
    >
      <a className={styles.skipLink} href="#main-content">
        {content.skipLink}
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className={styles.siteHeader}>
        <div className={styles.navInner}>
          <Link
            className={styles.brand}
            to={localizedPath}
            aria-label={content.brand.name}
          >
            <img
              src="/icons/linco-logo-96.webp"
              alt=""
              width="48"
              height="48"
            />
            <span>
              <strong>{content.brand.name}</strong>
              <small>{content.brand.descriptor}</small>
            </span>
          </Link>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={isMenuOpen ? content.nav.close : content.nav.open}
            aria-expanded={isMenuOpen}
            aria-controls="landing-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? (
              <IoCloseOutline aria-hidden="true" />
            ) : (
              <IoMenuOutline aria-hidden="true" />
            )}
          </button>

          <nav
            id="landing-navigation"
            className={`${styles.navigation} ${isMenuOpen ? styles.navigationOpen : ""}`}
            aria-label={content.nav.aria}
          >
            <div className={styles.navLinks}>
              <a href="#features">{content.nav.features}</a>
              <a href="#how-it-works">{content.nav.howItWorks}</a>
              <a href="#solutions">{content.nav.solutions}</a>
              <a href="#faq">{content.nav.faq}</a>
            </div>
            <div className={styles.navActions}>
              <button
                type="button"
                className={styles.themeToggle}
                aria-label={content.nav.themeToggle}
                title={content.nav.themeToggle}
                onClick={toggleTheme}
              >
                <IoMoonOutline
                  className={styles.moonIcon}
                  aria-hidden="true"
                />
                <IoSunnyOutline
                  className={styles.sunIcon}
                  aria-hidden="true"
                />
              </button>
              <Link
                to={alternatePath}
                className={styles.languageLink}
                aria-label={content.nav.languageLabel}
                hrefLang={isArabic ? "en" : "ar"}
              >
                {content.nav.language}
              </Link>
              <Link to={PATHS.SIGNIN} className={styles.signInLink}>
                {content.nav.signIn}
              </Link>
              <Link to={PATHS.SIGNUP} className={styles.primaryButtonSmall}>
                {content.nav.createAccount}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{content.hero.eyebrow}</p>
              <h1 id="hero-title">{content.hero.title}</h1>
              <p className={styles.heroDescription}>{content.hero.description}</p>
              <div className={styles.heroActions}>
                <Link to={PATHS.SIGNUP} className={styles.primaryButton}>
                  {content.hero.primaryCta}
                  <IoArrowForwardOutline aria-hidden="true" />
                </Link>
                <a href="#features" className={styles.secondaryButton}>
                  {content.hero.secondaryCta}
                </a>
              </div>
              <ul className={styles.heroPoints}>
                {content.hero.points.map((point) => (
                  <li key={point}>
                    <IoCheckmarkCircle aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.productWindow}>
                <div className={styles.windowBar} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <ProductPreview item={content.evidence.items[0]} />
              </div>
              <div className={styles.heroPanel}>
                <span>{content.hero.panelLabel}</span>
                <ul>
                  {content.hero.panelItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.outcomesSection}`}
          aria-labelledby="outcomes-title"
        >
          <div className={styles.container}>
            <SectionHeader
              eyebrow={content.outcomes.eyebrow}
              title={content.outcomes.title}
              description={content.outcomes.description}
              id="outcomes-title"
            />
            <div className={styles.outcomesGrid}>
              {content.outcomes.items.map((item, index) => {
                const Icon = OUTCOME_ICONS[index];
                return (
                  <article
                    className={styles.outcomeCard}
                    key={item.title}
                    data-scroll-reveal="up"
                    style={revealDelay(index)}
                  >
                    <span className={styles.iconBox}>
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className={`${styles.section} ${styles.howSection}`}
          aria-labelledby="how-title"
        >
          <div className={styles.container}>
            <SectionHeader
              eyebrow={content.how.eyebrow}
              title={content.how.title}
              description={content.how.description}
              id="how-title"
            />
            <ol className={styles.stepsGrid}>
              {content.how.steps.map((step, index) => (
                <li
                  key={step.number}
                  data-scroll-reveal="up"
                  style={revealDelay(index, 110)}
                >
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="features"
          className={`${styles.section} ${styles.featuresSection}`}
          aria-labelledby="features-title"
        >
          <div className={styles.container}>
            <SectionHeader
              eyebrow={content.features.eyebrow}
              title={content.features.title}
              description={content.features.description}
              id="features-title"
            />
            <div className={styles.featureGrid}>
              {content.features.items.map((item, index) => {
                const Icon = FEATURE_ICONS[index];
                return (
                  <article
                    className={styles.featureCard}
                    key={item.title}
                    data-scroll-reveal="scale"
                    style={revealDelay(index)}
                  >
                    <div className={styles.featureCardTop}>
                      <span className={styles.featureIcon}>
                        <Icon aria-hidden="true" />
                      </span>
                      <span className={styles.featureLabel}>{item.label}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.evidenceSection}`}
          aria-labelledby="evidence-title"
        >
          <div className={styles.container}>
            <SectionHeader
              eyebrow={content.evidence.eyebrow}
              title={content.evidence.title}
              description={content.evidence.description}
              id="evidence-title"
            />
            <div className={styles.evidenceList}>
              {content.evidence.items.map((item, index) => (
                <article
                  className={`${styles.evidenceRow} ${index % 2 ? styles.evidenceReverse : ""}`}
                  key={item.title}
                >
                  <div
                    className={styles.evidenceImage}
                    data-scroll-reveal={index % 2 ? "right" : "left"}
                  >
                    <ProductPreview item={item} variant={index} />
                  </div>
                  <div
                    className={styles.evidenceCopy}
                    data-scroll-reveal={index % 2 ? "left" : "right"}
                    style={revealDelay(1, 120)}
                  >
                    <span className={styles.evidenceIndex}>0{index + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <ul>
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>
                          <IoCheckmarkCircle aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="solutions"
          className={`${styles.section} ${styles.solutionsSection}`}
          aria-labelledby="solutions-title"
        >
          <div className={styles.container}>
            <SectionHeader
              eyebrow={content.solutions.eyebrow}
              title={content.solutions.title}
              description={content.solutions.description}
              id="solutions-title"
            />
            <div className={styles.solutionsGrid}>
              {content.solutions.items.map((item, index) => {
                const Icon = SOLUTION_ICONS[index];
                return (
                  <article
                    className={styles.solutionCard}
                    key={item.title}
                    data-scroll-reveal="up"
                    style={revealDelay(index, 75)}
                  >
                    <span>
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="faq"
          className={`${styles.section} ${styles.faqSection}`}
          aria-labelledby="faq-title"
        >
          <div className={`${styles.container} ${styles.faqLayout}`}>
            <SectionHeader
              eyebrow={content.faq.eyebrow}
              title={content.faq.title}
              description={content.faq.description}
              id="faq-title"
              align="start"
            />
            <div className={styles.faqList} data-scroll-reveal="up">
              {content.faq.items.map((item, index) => (
                <FAQItem
                  key={item.question}
                  item={item}
                  isOpen={openFaq === index}
                  onToggle={() =>
                    setOpenFaq((current) => (current === index ? -1 : index))
                  }
                  buttonId={`faq-button-${index}`}
                  panelId={`faq-panel-${index}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection} aria-labelledby="cta-title">
          <div
            className={`${styles.container} ${styles.ctaPanel}`}
            data-scroll-reveal="scale"
          >
            <p className={styles.eyebrow}>{content.cta.eyebrow}</p>
            <h2 id="cta-title">{content.cta.title}</h2>
            <p>{content.cta.description}</p>
            <div className={styles.ctaActions}>
              <Link to={PATHS.SIGNUP} className={styles.primaryButton}>
                {content.cta.primary}
                <IoArrowForwardOutline aria-hidden="true" />
              </Link>
              <Link to={PATHS.SIGNIN} className={styles.secondaryButtonDark}>
                {content.cta.secondary}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <Link to={localizedPath} className={styles.brand}>
              <img
                src="/icons/linco-logo-96.webp"
                alt=""
                width="48"
                height="48"
                loading="lazy"
              />
              <span>
                <strong>{content.brand.name}</strong>
                <small>{content.brand.descriptor}</small>
              </span>
            </Link>
            <p>{content.footer.description}</p>
          </div>
          <div className={styles.footerColumn}>
            <h2>{content.footer.product}</h2>
            <a href="#features">{content.footer.features}</a>
            <a href="#how-it-works">{content.footer.howItWorks}</a>
            <a href="#solutions">{content.footer.solutions}</a>
            <a href="#faq">{content.footer.faq}</a>
          </div>
          <div className={styles.footerColumn}>
            <h2>{content.footer.contact}</h2>
            <a href={`mailto:${content.footer.email}`}>{content.footer.email}</a>
          </div>
        </div>
        <div className={`${styles.container} ${styles.footerBottom}`}>
          <span>{content.footer.copyright}</span>
          <Link
            to={alternatePath}
            hrefLang={isArabic ? "en" : "ar"}
            aria-label={content.nav.languageLabel}
          >
            {content.nav.language}
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
