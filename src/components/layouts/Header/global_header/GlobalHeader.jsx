import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { useHeader } from "../hooks/useHeader.jsx"; // تأكد من مسار الهوك
import { SUBHEADER_CONFIG } from "../../../../config/layoutConfig.jsx";
import { PATHS } from "../../../../routes/paths";
import appIconImg from "/public/images/linco-logo.jpg";
import styles from "./GlobalHeader.module.css"; // تم تعديل اسم الملف ليكون مطابقاً
import { useTranslation } from "react-i18next";

const GlobalHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    dropdownRef,
    isDropdownOpen,
    isAuthenticated,
    fullName,
    initials,
    imagePath,
    toggleDropdown,
    closeDropdown,
    handleLogout,
  } = useHeader();

  const globalLinks = SUBHEADER_CONFIG.global.navLinks;

  return (
    <header className={styles.header}>
      <div className={styles["header-left"]}>
        <div className={styles.logo}>
          <span className={styles["brand-name"]}>{t("linco", "LinCo.")}</span>{" "}
          <span className={styles["company-text"]}>
            {t("link-company-0", "Link Company")}
          </span>
        </div>

        <div
          className={styles["user-profile"]}
          ref={dropdownRef}
          onClick={toggleDropdown}
        >
          <div className={styles["user-avatar"]}>
            {imagePath ? (
              <img
                src={imagePath}
                alt={`${fullName}'s profile`}
                className={styles["avatar-img"]}
              />
            ) : (
              initials || "U"
            )}
          </div>
          <span className={styles["user-name"]}>{fullName}</span>
          <div
            className={`${styles["dropdown-icon"]} ${isDropdownOpen ? styles["open"] : ""}`}
          ></div>

          {isDropdownOpen && (
            <div className={styles["dropdown-menu"]}>
              {isAuthenticated ? (
                <>
                  <Link
                    to={PATHS.PROFILE}
                    className={styles["dropdown-item"]}
                    onClick={closeDropdown}
                  >
                    {t("my-profile", "My Profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`${styles["dropdown-item"]} ${styles["logout-btn"]}`}
                  >
                    {t("sign-out", "Sign out")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={PATHS.SIGNIN}
                    className={styles["dropdown-item"]}
                    onClick={closeDropdown}
                  >
                    {t("sign-in", "Sign in")}
                  </Link>
                  <Link
                    to={PATHS.SIGNUP}
                    className={styles["dropdown-item"]}
                    onClick={closeDropdown}
                  >
                    {t("sign-up", "Sign up")}
                  </Link>
                </>
              )}
            </div>
          )}
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
              {link.name}
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
            alt="App Icon"
            className={styles["app-icon-img"]}
          />
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
