import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { FOOTER_CONFIG } from "./footerConfig";
import { useTranslation } from "react-i18next";

const Footer = ({ footerLinks }) => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles["footer-grid"]}>
        <div className={styles["footer-col"]}>
          <h4>{t("quick-links")}</h4>
          <ul className={styles["quick-links"]}>
            {footerLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles["footer-col"]}>
          <h4>{t("contact-info")}</h4>
          <ul>
            <li>{t("damascus-syria")}</li>
            <li>contact@linco.com</li>
            <li>+963-XXX-XXXXXX</li>
          </ul>
        </div>

        <div className={styles["footer-col"]}>
          <h4>{t("legal")}</h4>
          <ul>
            <li>
              <Link
                to="/terms"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {t("terms-of-service")}
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {t("privacy-policy")}
              </Link>
            </li>
            <li>
              <Link
                to="/cookies"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {t("cookies-policy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles["footer-bottom"]}>
        {t("and-copy-2026-linco-all-rights-reserved")}
      </div>
    </footer>
  );
};

export default Footer;
