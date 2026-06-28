import { Link } from "react-router-dom";
import { useScrollReveal } from "../../../../hooks/useScrollReveal";
import { PATHS } from "../../../../routes/paths";
import stylesLanding from "../../LandingPage.module.css";
import { useTranslation } from "react-i18next";

const CTASection = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`reveal-up ${isVisible ? "reveal-visible" : ""}`}
      style={{
        padding: "80px 20px",
        textAlign: "center",
        backgroundColor: "#f8fafc",
      }}
    >
      <h2 className={stylesLanding.sectionTitle}>{t("start-your-journey")}</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <Link to={PATHS.SIGNUP} className={stylesLanding.btnSecondary}>
          {t("create-account")}
        </Link>
        <Link to={PATHS.SIGNIN} className={stylesLanding.btnSecondary}>
          {t("log-in")}
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
