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
  const { t } = useTranslation();
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
            aria-label="LinCo home"
          >
            <img src="/icons/linco-logo-96.webp" alt="" width="48" height="48" />
            <span>
              <strong>LinCo</strong>
              <small>Link Company</small>
            </span>
          </Link>

          <div className={styles["brand-text"]}>
            <p className={styles.eyebrow}>Corporate learning, connected</p>
            <h2>Welcome back to your team&apos;s learning demo.</h2>
            <p>
              {t(
                "transform-the-way-your-company-learns-build-a-centralized-hub-for-onboarding-training-and-team-collaboration-0",
              )}
            </p>
            <ul className={styles["benefit-list"]}>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>Learning paths in one place</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>Live sessions and team collaboration</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>Clear progress for every department</span>
              </li>
            </ul>
          </div>

          <div className={styles["workspace-preview"]} aria-hidden="true">
            <div className={styles["preview-header"]}>
              <span>Learning demo</span>
              <small>Active</small>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoBookOutline />
              </span>
              <span>
                <strong>Team courses</strong>
                <small>12 learning activities</small>
              </span>
              <i style={{ "--preview-progress": "82%" }} />
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoAnalyticsOutline />
              </span>
              <span>
                <strong>Weekly progress</strong>
                <small>On track</small>
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
              {is2FAStep ? "Secure verification" : "Welcome back"}
            </span>
            <h1 className={styles.title}>
              {is2FAStep ? "Two-Factor Authentication" : t("sign-in")}
            </h1>
            <p className={styles.subtitle}>
              {is2FAStep ? (
                "Please enter the 6-digit code from your authenticator app."
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={styles["white-input"]}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className={styles["icon-btn"]}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
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
                      OR WITH GOOGLE
                    </span>
                    <div className={styles.line}></div>
                  </div>

                  <button
                    type="button"
                    className={styles["btn-google"]}
                    onClick={handleGoogleLogin}
                  >
                    <FcGoogle className={styles["google-icon"]} />
                    Continue with Google
                  </button>

                  <div className={styles["forgot-password"]}>
                    <span>Forget password ? </span>
                    <button
                      type="button"
                      onClick={() => navigate(PATHS.FORGOT_PASSWORD)}
                      className={styles["forgot-link"]}
                    >
                      Yes
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
                          ? "Sending..."
                          : "Resend Verification Email"}
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
                  Sign Up
                </button>
                <button
                  type="submit"
                  className={styles["btn-primary"]}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
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
                      aria-label="Six-digit authentication code"
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
                    Back
                  </button>
                  <button
                    type="submit"
                    className={styles["btn-primary"]}
                    disabled={isVerifying2FA}
                  >
                    {isVerifying2FA ? "Verifying..." : "Verify"}
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
