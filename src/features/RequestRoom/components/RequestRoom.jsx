import { Link, useNavigate } from "react-router-dom";
import {
  IoAnalyticsOutline,
  IoArrowForwardOutline,
  IoBusinessOutline,
  IoCheckmarkCircle,
  IoChevronBackOutline,
  IoMoonOutline,
  IoShieldCheckmarkOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/common/LanguageSwitcher.jsx";
import { useTheme } from "../../../hooks/useTheme.js";
import { PATHS } from "../../../routes/paths.js";
import { useRequestRoom } from "../hooks/useRequestRoom.jsx";
import RequestRoomStep1 from "./RequestRoomStep1.jsx";
import styles from "./RequestRoom.module.css";

const RequestRoom = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const {
    formData,
    previews,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    clearFile,
    handleSubmit,
  } = useRequestRoom();

  const themeToggleLabel = t(
    isDark ? "switch-to-light-theme" : "switch-to-dark-theme",
  );

  return (
    <div className={styles["page-container"]}>
      <aside className={styles["left-panel"]}>
        <div className={styles["panel-grid"]} aria-hidden="true" />
        <div className={styles["panel-glow"]} aria-hidden="true" />
        <div className={styles["left-content"]}>
          <div className={styles["brand-row"]}>
            <Link
              to={PATHS.HOME}
              className={styles["brand-link"]}
              aria-label={t("request-workspace-go-home")}
            >
              <img src="/icons/linco-logo-96.webp" alt="" width="48" height="48" />
              <span>
                <strong>{t("linco")}</strong>
                <small>{t("link-company")}</small>
              </span>
            </Link>

            <div className={styles["utility-actions"]}>
              <LanguageSwitcher />
              <button
                type="button"
                className={styles["theme-toggle"]}
                onClick={toggleTheme}
                title={themeToggleLabel}
                aria-label={themeToggleLabel}
              >
                {isDark ? (
                  <IoSunnyOutline aria-hidden="true" />
                ) : (
                  <IoMoonOutline aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className={styles["brand-text"]}>
            <p className={styles.eyebrow}>{t("request-workspace-kicker")}</p>
            <h2>{t("request-workspace-hero-title")}</h2>
            <p>{t("request-workspace-hero-description")}</p>
            <ul className={styles["benefit-list"]}>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("request-workspace-benefit-one")}</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("request-workspace-benefit-two")}</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("request-workspace-benefit-three")}</span>
              </li>
            </ul>
          </div>

          <div className={styles["workspace-preview"]} aria-hidden="true">
            <div className={styles["preview-header"]}>
              <span>{t("request-workspace-preview-title")}</span>
              <small>{t("request-workspace-preview-status")}</small>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoBusinessOutline />
              </span>
              <span>
                <strong>{t("request-workspace-preview-identity")}</strong>
                <small>{t("request-workspace-preview-identity-description")}</small>
              </span>
              <IoCheckmarkCircle className={styles["preview-check"]} />
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoShieldCheckmarkOutline />
              </span>
              <span>
                <strong>{t("request-workspace-preview-review")}</strong>
                <small>{t("request-workspace-preview-review-description")}</small>
              </span>
              <IoAnalyticsOutline className={styles["preview-check"]} />
            </div>
          </div>
        </div>
      </aside>

      <main className={styles["right-panel"]}>
        <div className={styles["form-wrapper"]}>
          <div className={styles.header}>
            <button
              type="button"
              className={styles["back-nav-btn"]}
              onClick={() => navigate(-1)}
              aria-label={t("back")}
            >
              <IoChevronBackOutline aria-hidden="true" />
            </button>
            <div>
              <span className={styles["header-kicker"]}>
                {t("request-workspace-form-kicker")}
              </span>
              <h1 className={styles.title}>{t("request-room")}</h1>
              <p className={styles.subtitle}>
                {t("request-workspace-form-description")}
              </p>
            </div>
          </div>

          <form
            className={styles["auth-form"]}
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
            noValidate
          >
            <div className={styles["form-card"]}>
              <RequestRoomStep1
                formData={formData}
                previews={previews}
                onChange={handleInputChange}
                onFileChange={handleFileChange}
                onClearFile={clearFile}
                errors={errors}
              />
            </div>

            {errors.submit && (
              <div
                className={styles["server-error-banner"]}
                role="alert"
                aria-live="polite"
              >
                {errors.submit}
              </div>
            )}

            <div className={styles["bottom-actions"]}>
              <button
                type="button"
                className={styles["btn-secondary"]}
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                {t("back")}
              </button>
              <button
                type="submit"
                className={styles["btn-primary"]}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  t("request-workspace-submitting")
                ) : (
                  <>
                    {t("request-room")}
                    <IoArrowForwardOutline
                      className={styles["forward-icon"]}
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RequestRoom;
