import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./SubHeader.module.css";

const SubHeader = ({ navLinks }) => {
  const { t } = useTranslation();
  if (!navLinks || !Array.isArray(navLinks) || navLinks.length === 0) {
    console.warn(
      "SubHeader is hidden because navLinks is empty or invalid:",
      navLinks,
    );
    return null;
  }

  return (
    <div className={styles.subHeader}>
      <nav className={styles.navLinks} aria-label={t("workspace-navigation")}>
        {navLinks.map((link, index) => {
          const isHomeLink = !link.path;

          return (
            <div key={link.path || link.name} className={styles.navItem}>
              <NavLink
                to={isHomeLink ? "." : link.path}
                end={isHomeLink}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.linkText}>
                  {t(link.translationKey || link.name, link.name)}
                </span>
              </NavLink>

              {index < navLinks.length - 1 && (
                <div className={styles.divider} aria-hidden="true"></div>
              )}
            </div>
          );
        })}
      </nav>
      <div className={styles.edgeFadeRight}></div>
    </div>
  );
};

export default SubHeader;
