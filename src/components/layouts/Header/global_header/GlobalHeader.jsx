import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { useHeader } from "../hooks/useHeader.jsx";
import { HEADER_CONFIG } from "../headerConfig";
import { PATHS } from "../../../../routes/paths";
import appIconImg from "/public/images/linco-logo.jpg";
import styles from "./Header.module.css";
import LanguageSwitcher from "../../../common/LanguageSwitcher.jsx";
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

  const globalLinks = HEADER_CONFIG.global.navLinks;

  return (
    <header className={styles.header}>
      <div className={styles["header-left"]}>
        <div className={styles.logo}>
          <span className={styles["brand-name"]}>{t("linco")}</span>{" "}
          <span className={styles["company-text"]}>{t("link-company-0")}</span>
        </div>

        <div
          className={styles["user-profile"]}
          ref={dropdownRef}
          onClick={toggleDropdown}
        >
          <div className={styles["user-avatar"]}>
            {imagePath && imagePath !== "123456789" ? (
              <img
                src={imagePath}
                alt={`${fullName}'s profile`}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              initials
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
                    {t("my-profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`${styles["dropdown-item"]} ${styles["logout-btn"]}`}
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className={styles["dropdown-item"]}
                    onClick={closeDropdown}
                  >
                    {t("sign-in")}
                  </Link>
                  <Link
                    to="/signup"
                    className={styles["dropdown-item"]}
                    onClick={closeDropdown}
                  >
                    {t("sign-up")}
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
      <LanguageSwitcher />
      <div className={styles["header-actions"]}>
        <button className={styles["btn-workspace"]} onClick={() => navigate(PATHS.REQUEST_ROOM)}>
          <IoPersonOutline style={{ marginRight: "5px" }} />{" "}
          {t('request-a-room')}
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
