import { Link } from "react-router-dom";
import { useScrollReveal } from "../../../../hooks/useScrollReveal";
import { PATHS } from "../../../../routes/paths";
import stylesLanding from "../../LandingPage.module.css";

const CTASection = () => {
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
      <h2 className={stylesLanding.sectionTitle}>Start Your Journey</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <Link to={PATHS.SIGNUP} className={stylesLanding.btnSecondary}>
          Create Account
        </Link>
        <Link to={PATHS.SIGNIN} className={stylesLanding.btnSecondary}>
          Log In
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
