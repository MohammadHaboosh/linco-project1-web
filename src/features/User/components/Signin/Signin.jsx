import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoAnalyticsOutline,
  IoBookOutline,
  IoCheckmarkCircle,
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useSignin } from "../../hooks/useSignin.jsx";
import { PATHS } from "../../../../routes/paths.js";
import styles from "./Signin.module.css";

import { useTranslation } from "react-i18next";

const Signin = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(
    i18n.resolvedLanguage || i18n.language || "en",
  );
  const {
    formData,
    errors,
    serverError,
    isSubmitting,
    isUnverified,
    isResending,
    resendMessage,
    handleInputChange,
    handleSubmit,
    handleResendVerification,
    // 2FA Destructuring
    is2FAStep,
    setIs2FAStep,
    twoFactorCode,
    setTwoFactorCode,
    isVerifying2FA,
    twoFactorError,
    handleVerify2FA,
  } = useSignin();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleGoogleLogin = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${BASE_URL}/authentication/google`;
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
            <p className={styles.eyebrow}>{t("auth-signin-eyebrow")}</p>
            <h2>{t("auth-signin-hero-title")}</h2>
            <p>
              {t(
                "transform-the-way-your-company-learns-build-a-centralized-hub-for-onboarding-training-and-team-collaboration-0",
              )}
            </p>
            <ul className={styles["benefit-list"]}>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-benefit-learning-paths")}</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-benefit-live-collaboration")}</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-benefit-clear-progress")}</span>
              </li>
            </ul>
          </div>

          <div className={styles["workspace-preview"]} aria-hidden="true">
            <div className={styles["preview-header"]}>
              <span>{t("auth-learning-demo")}</span>
              <small>{t("auth-active")}</small>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoBookOutline />
              </span>
              <span>
                <strong>{t("auth-team-courses")}</strong>
                <small>
                  {t("auth-learning-activities", {
                    formattedCount: numberFormatter.format(12),
                  })}
                </small>
              </span>
              <i style={{ "--preview-progress": "82%" }} />
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoAnalyticsOutline />
              </span>
              <span>
                <strong>{t("auth-weekly-progress")}</strong>
                <small>{t("auth-on-track")}</small>
              </span>
              <i style={{ "--preview-progress": "68%" }} />
            </div>
          </div>
        </div>
      </aside>

      <main className={styles["right-panel"]}>
        <div className={styles["form-wrapper"]}>
          <div className={styles.header}>
            <span className={styles["header-kicker"]}>
              {is2FAStep
                ? t("auth-secure-verification")
                : t("welcome-back")}
            </span>
            <h1 className={styles.title}>
              {is2FAStep ? t("auth-two-factor-authentication") : t("sign-in")}
            </h1>
            <p className={styles.subtitle}>
              {is2FAStep ? (
                t("auth-enter-authenticator-code")
              ) : (
                <>
                  {t("welcome-back")}
                  <br />
                  {t("sign-in-to-continue-your-learning-journey")}
                </>
              )}
            </p>
          </div>

          <form
            className={styles["auth-form"]}
            onSubmit={is2FAStep ? handleVerify2FA : handleSubmit}
          >
            {!is2FAStep ? (
              <>
                <div className={styles["form-card"]}>
                  <div className={styles["input-group"]}>
                    <IoMailOutline className={styles["icon-left"]} />
                    <input
                      type="email"
                      name="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles["white-input"]}
                      autoComplete="email"
                      dir="ltr"
                    />
                    {errors.email && (
                      <span className={styles["error-text"]}>{errors.email}</span>
                    )}
                  </div>

                  <div className={styles["input-group"]}>
                    <IoLockClosedOutline className={styles["icon-left"]} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={t("auth-enter-password")}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={styles["white-input"]}
                      autoComplete="current-password"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className={styles["icon-btn"]}
                      aria-label={
                        showPassword
                          ? t("auth-hide-password")
                          : t("auth-show-password")
                      }
                    >
                      {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </button>
                    {errors.password && (
                      <span className={styles["error-text"]}>
                        {errors.password}
                      </span>
                    )}
                  </div>

                  <div className={styles["divider-container"]}>
                    <div className={styles.line}></div>
                    <span className={styles["divider-text"]}>
                      {t("auth-or-with-google")}
                    </span>
                    <div className={styles.line}></div>
                  </div>

                  <button
                    type="button"
                    className={styles["btn-google"]}
                    onClick={handleGoogleLogin}
                  >
                    <FcGoogle className={styles["google-icon"]} />
                    {t("auth-continue-with-google")}
                  </button>

                  <div className={styles["forgot-password"]}>
                    <span>{t("auth-forgot-password-question")} </span>
                    <button
                      type="button"
                      onClick={() => navigate(PATHS.FORGOT_PASSWORD)}
                      className={styles["forgot-link"]}
                    >
                      {t("auth-reset-it")}
                    </button>
                  </div>
                </div>

              {serverError && (
                <div className={styles["server-error-banner"]}>
                  <span>{serverError}</span>
                  {isUnverified && (
                    <div className={styles["resend-container"]}>
                      <button
                        type="button"
                        className={styles["btn-resend"]}
                        onClick={handleResendVerification}
                        disabled={isResending}
                      >
                        {isResending
                          ? t("auth-sending")
                          : t("auth-resend-verification-email")}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {resendMessage.text && (
                <div
                  className={`${styles["resend-message"]} ${
                    styles[resendMessage.type]
                  }`}
                >
                  {resendMessage.text}
                </div>
              )}

              <div className={styles["bottom-actions"]}>
                <button
                  type="button"
                  className={styles["btn-secondary"]}
                  onClick={() => navigate(PATHS.SIGNUP)}
                >
                  {t("sign-up")}
                </button>
                <button
                  type="submit"
                  className={styles["btn-primary"]}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("auth-signing-in") : t("sign-in")}
                </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles["form-card"]}>
                  <div className={styles["input-group"]}>
                    <IoLockClosedOutline className={styles["icon-left"]} />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength="6"
                      placeholder="000000"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className={`${styles["white-input"]} ${styles["code-input"]}`}
                      aria-label={t("verification-code")}
                      dir="ltr"
                    />
                  </div>
                  {twoFactorError && (
                    <span className={styles["error-text"]}>
                      {twoFactorError}
                    </span>
                  )}
                </div>

                <div className={styles["bottom-actions"]}>
                  <button
                    type="button"
                    className={styles["btn-secondary"]}
                    onClick={() => setIs2FAStep(false)}
                  >
                    {t("back")}
                  </button>
                  <button
                    type="submit"
                    className={styles["btn-primary"]}
                    disabled={isVerifying2FA}
                  >
                    {isVerifying2FA ? t("auth-verifying") : t("auth-verify")}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signin;
