import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { useHeader } from "../hooks/useHeader.jsx";
import { DASHBOARD_NAV } from "../../../../config/layoutConfig.jsx";
import { PATHS } from "../../../../routes/paths";
import appIconImg from "/public/images/linco-logo.jpg";
import styles from "./GlobalHeader.module.css";
import { useTranslation } from "react-i18next";

const GlobalHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName, initials, imagePath } = useHeader();

  const globalLinks = DASHBOARD_NAV.global.navLinks;

  return (
    <header className={styles.header}>
      <div className={styles["header-left"]}>
        <div className={styles.logo}>
          <span className={styles["brand-name"]}>{t("linco", "LinCo.")}</span>{" "}
          <span className={styles["company-text"]}>
            {t("link-company-0", "Link Company")}
          </span>
        </div>

        <div className={styles["user-profile"]}>
          <div className={styles["user-avatar"]}>
            {imagePath ? (
              <img
                src={imagePath}
                alt={t("profile-image-alt", { name: fullName })}
                className={styles["user-avatar"]}
              />
            ) : (
              initials || "U"
            )}
          </div>
          <span className={styles["user-name"]}>{fullName}</span>
        </div>
      </div>

      <nav className={styles["nav-links"]}>
        {globalLinks.map((link, index) => (
          <div key={index} className={styles["nav-item-wrapper"]}>
            <Link
              to={link.path}
              className={
                location.pathname === link.path ||
                (index === 0 && location.pathname === "/")
                  ? styles.active
                  : ""
              }
            >
              {t(link.translationKey, link.name)}
            </Link>
            {index < globalLinks.length - 1 && (
              <div className={styles["nav-divider"]}></div>
            )}
          </div>
        ))}
      </nav>

      <div className={styles["header-actions"]}>
        <button
          className={styles["btn-workspace"]}
          onClick={() => navigate(PATHS.REQUEST_ROOM)}
        >
          <IoPersonOutline className={styles["btn-icon"]} />{" "}
          {t("request-a-room", "Request a room")}
        </button>
        <div className={styles["app-icon"]}>
          <img
            src={appIconImg}
            alt={t("app-icon-alt")}
            className={styles["app-icon-img"]}
          />
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
