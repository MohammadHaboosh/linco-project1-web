import { NavLink } from "react-router-dom";
import styles from "./SubHeader.module.css";

const SubHeader = ({ navLinks }) => {
  if (!navLinks || !Array.isArray(navLinks) || navLinks.length === 0) {
    console.warn(
      "SubHeader is hidden because navLinks is empty or invalid:",
      navLinks,
    );
    return null;
  }

  return (
    <div className={styles.subHeader}>
      <nav className={styles.navLinks}>
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
                {link.name}
              </NavLink>

              {index < navLinks.length - 1 && (
                <div className={styles.divider}></div>
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
