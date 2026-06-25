import { Link } from "react-router-dom";
import { COLORS } from "../../theme/colors";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { PATHS } from "../../routes/paths";
import styles from "./LandingPage.module.css";
import logoImg from "/public/icons/linco-logo.png";
import Footer from "../../components/layouts/Footer/Footer";

import FeaturesSection from "./sections/FeaturesSection/FeaturesSection";
import SolutionsSection from "./sections/SolutionsSection/SolutionsSection";
import TestimonialsSection from "./sections/TestimonialsSection/TestimonialsSection";
import FAQSection from "./sections/FAQSection/FAQSection";
import CTASection from "./sections/CTASection/CTASection";

const LandingPage = () => {
  const { ref: heroRef, isVisible: isHeroVisible } = useScrollReveal();

  return (
    <div className={styles.landingContainer}>
      <nav className={styles.landingNav}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={logoImg}
            alt="LinCo"
            style={{ width: "45px", borderRadius: "50%" }}
          />
          <h2 className={styles.navBrandText}>LinCo.</h2>
        </div>
        <div className={styles.navLinks}>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className={styles.navActions}>
          <Link to={PATHS.SIGNIN} className={styles.btnOutline}>
            Log In
          </Link>
          <Link to={PATHS.SIGNUP} className={styles.btnPrimary}>
            Sign Up
          </Link>
        </div>

        <div className={styles.navLine}></div>
      </nav>

      <section
        id="home"
        className={styles.heroSection}
        style={{ background: COLORS.navyGradient }}
      >
        <div
          className={`${styles.heroContent} reveal-up ${isHeroVisible ? "reveal-visible" : ""}`}
          ref={heroRef}
        >
          <div className={styles.heroText}>
            <div className={styles.heroBrandHeader}>
              <img
                src={logoImg}
                alt="LinCo Mascot"
                className={styles.heroMascot}
              />
              <div className={styles.heroBrandTitles}>
                <h1>LinCo..</h1>
                <span>Link Company</span>
              </div>
            </div>

            <h2 className={styles.heroSubTitle}>
              Empowering Engineers for the Real World
            </h2>

            <p className={styles.heroDesc}>
              An all-in-one virtual workspace designed to transform trainees
              into industry-ready professionals through interactive coding,
              agile management, and live design labs
            </p>

            <div style={{ display: "flex", gap: "15px" }}>
              <Link to={PATHS.SIGNIN} className={styles.btnPrimary}>
                Login
              </Link>
              <button className={styles.btnOutline}>View Road Map</button>
            </div>
          </div>

          <div className={styles.heroImages}>
            <div className={styles.heroComposition}>
              <div className={styles.calmGlow}></div>

              <img
                src="/images/hero-landing/hero-video.png"
                alt="Dashboard"
                className={styles.compLayer1}
              />
              <img
                src="/images/hero-landing/hero-xp.png"
                alt="Mobile"
                className={styles.compLayer2}
              />
              <div className={styles.compLayer3Code}>
                <div className={styles.codeHeader}>
                  <div className={styles.macDotsCode}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className={styles.codeTitle}>Solution.jsx</span>
                </div>
                <pre className={styles.codeBody}>
                  <code>
                    <span className={styles.tokenKeyword}>import</span> React,{" "}
                    {"{ useState }"}{" "}
                    <span className={styles.tokenKeyword}>from</span>{" "}
                    <span className={styles.tokenString}>'react'</span>;
                    <br />
                    <br />
                    <span className={styles.tokenKeyword}>
                      export default function
                    </span>{" "}
                    <span className={styles.tokenFunction}>Solution</span>(){" "}
                    {"{"}
                    <br />
                    {"  "}
                    <span className={styles.tokenKeyword}>return</span> (
                    <br />
                    {"    "}&lt;<span className={styles.tokenTag}>div</span>{" "}
                    className=<span className={styles.tokenString}>"flex"</span>
                    &gt;
                    <br />
                    {"      "}Algorithms & Data Structures
                    <br />
                    {"    "}&lt;/<span className={styles.tokenTag}>div</span>
                    &gt;
                    <br />
                    {"  "});
                    <br />
                    {"}"}
                  </code>
                </pre>
              </div>
              <img
                src="/images/hero-landing/DB1 1.png"
                alt="Database"
                className={styles.compLayer4}
              />
            </div>
          </div>
        </div>
        <div className="wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,120.2,192,105.8,236.4,95.5,279.7,78.2,321.39,56.44Z"
              fill="#f8fafc"
            ></path>
          </svg>
        </div>
      </section>

      <FeaturesSection />
      <SolutionsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />

      <div className={styles.footerContainer}>
        <Footer role="global" />
      </div>
    </div>
  );
};

export default LandingPage;
