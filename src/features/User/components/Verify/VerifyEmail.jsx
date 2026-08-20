import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoCheckmarkCircle,
  IoLockClosedOutline,
  IoMailOpenOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { resendVerificationEmail } from "../../api/userApi.js";
import { PATHS } from "../../../../routes/paths.js";
import { Trans, useTranslation } from "react-i18next";
import styles from "./VerifyEmail.module.css";

const VerifyEmail = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const userEmail = location.state?.email;
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState({
    type: "",
    text: "",
  });

  const handleResend = async () => {
    if (!userEmail) {
      setResendMessage({
        type: "error",
        text: t("auth-email-address-not-found"),
      });
      return;
    }

    setIsResending(true);
    setResendMessage({ type: "", text: "" });

    try {
      await resendVerificationEmail(userEmail);
      setResendMessage({
        type: "success",
        text: t("auth-new-verification-email-sent"),
      });
    } catch (error) {
      setResendMessage({
        type: "error",
        text: error.message || t("auth-resend-email-failed"),
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles["page-container"]}>
      <aside className={styles["left-panel"]}>
        <div className={styles["panel-grid"]} aria-hidden="true" />
        <div className={styles["panel-glow"]} aria-hidden="true" />
        <div className={styles["left-content"]}>
          <Link
            to={PATHS.LANDING}
            className={styles["brand-link"]}
            aria-label={t("auth-linco-home")}
          >
            <img src="/icons/linco-logo-96.webp" alt="" width="48" height="48" />
            <span>
              <strong>{t("linco-brand")}</strong>
              <small>{t("link-company")}</small>
            </span>
          </Link>

          <div className={styles["brand-text"]}>
            <p className={styles.eyebrow}>{t("auth-one-last-step")}</p>
            <h2>{t("auth-learning-demo-almost-ready")}</h2>
            <p>{t("auth-verify-email-hero-description")}</p>
            <ul className={styles["benefit-list"]}>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-secure-account-activation")}</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-one-click-verification")}</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-instant-access-after-signin")}</span>
              </li>
            </ul>
          </div>

          <div className={styles["verification-preview"]} aria-hidden="true">
            <div className={styles["preview-header"]}>
              <span>{t("auth-account-setup")}</span>
              <small>{t("auth-email-sent")}</small>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoMailOpenOutline />
              </span>
              <span>
                <strong>{t("auth-check-your-inbox")}</strong>
                <small>{t("auth-open-email-from-linco")}</small>
              </span>
              <i>1</i>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoShieldCheckmarkOutline />
              </span>
              <span>
                <strong>{t("auth-verify-your-account")}</strong>
                <small>{t("auth-use-secure-link")}</small>
              </span>
              <i>2</i>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles["right-panel"]}>
        <section
          className={styles["verify-wrapper"]}
          aria-labelledby="verify-email-title"
        >
          <div className={styles["icon-container"]} aria-hidden="true">
            <span className={styles["icon-halo"]} />
            <IoMailOutline className={styles["mail-icon"]} />
            <IoCheckmarkCircle className={styles["status-icon"]} />
          </div>

          <header className={styles.header}>
            <span className={styles["header-kicker"]}>
              {t("auth-email-verification")}
            </span>
            <h1 id="verify-email-title" className={styles.title}>
              {t("auth-check-your-inbox")}
            </h1>
            <p className={styles.description}>
              {t("auth-verification-link-sent-to")}
            </p>
          </header>

          <div className={styles["email-card"]}>
            <IoMailOutline aria-hidden="true" />
            <strong dir={userEmail ? "ltr" : undefined}>
              {userEmail || t("auth-registered-email-address")}
            </strong>
          </div>

          <div className={styles["instruction-card"]}>
            <IoLockClosedOutline aria-hidden="true" />
            <p>
              <Trans
                i18nKey="auth-verify-email-instruction"
                components={{ strong: <strong /> }}
              />
            </p>
          </div>

          <Link to={PATHS.SIGNIN} className={styles["btn-primary"]}>
            {t("auth-continue-to-sign-in")}
            <IoArrowForwardOutline aria-hidden="true" />
          </Link>

          <div className={styles.divider} aria-hidden="true">
            <span>{t("auth-did-not-get-email")}</span>
          </div>

          <div className={styles["resend-section"]}>
            <p>{t("auth-check-spam-or-request-link")}</p>
            <button
              type="button"
              className={styles["btn-secondary"]}
              onClick={handleResend}
              disabled={isResending}
            >
              <IoMailOpenOutline aria-hidden="true" />
              {isResending
                ? t("auth-sending")
                : t("auth-resend-verification-email")}
            </button>
          </div>

          {resendMessage.text && (
            <div
              className={`${styles["resend-message"]} ${styles[resendMessage.type]}`}
              role="status"
              aria-live="polite"
            >
              {resendMessage.text}
            </div>
          )}

          <Link to={PATHS.SIGNUP} className={styles["back-link"]}>
            <IoArrowBackOutline className={styles["back-icon"]} aria-hidden="true" />
            {t("auth-back-to-sign-up")}
          </Link>
        </section>
      </main>
    </div>
  );
};

export default VerifyEmail;
