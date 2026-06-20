import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { FOOTER_CONFIG } from "./footerConfig";

const Footer = ({ role = "global" }) => {
  const quickLinks = FOOTER_CONFIG[role] || FOOTER_CONFIG.global;

  return (
    <footer className={styles.footer}>
      <div className={styles["footer-grid"]}>
        <div className={styles["footer-col"]}>
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((link, index) => (
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
          <h4>Contact Info</h4>
          <ul>
            <li>Damascus, Syria</li>
            <li>contact@linco.com</li>
            <li>+963-XXX-XXXXXX</li>
          </ul>
        </div>

        <div className={styles["footer-col"]}>
          <h4>Legal</h4>
          <ul>
            <li>
              <Link
                to="/terms"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/cookies"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Cookies Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles["footer-bottom"]}>
        &copy; 2026 LinCo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
