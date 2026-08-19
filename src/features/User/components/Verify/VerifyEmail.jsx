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
import styles from "./VerifyEmail.module.css";

const VerifyEmail = () => {
  const location = useLocation();
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
        text: "We couldn't find your email address. Please return to sign up.",
      });
      return;
    }

    setIsResending(true);
    setResendMessage({ type: "", text: "" });

    try {
      await resendVerificationEmail(userEmail);
      setResendMessage({
        type: "success",
        text: "A new verification email is on its way.",
      });
    } catch (error) {
      setResendMessage({
        type: "error",
        text: error.message || "We couldn't resend the email. Please try again.",
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
            aria-label="LinCo home"
          >
            <img src="/icons/linco-logo-96.webp" alt="" width="48" height="48" />
            <span>
              <strong>LinCo</strong>
              <small>Link Company</small>
            </span>
          </Link>

          <div className={styles["brand-text"]}>
            <p className={styles.eyebrow}>One last step</p>
            <h2>Your learning demo is almost ready.</h2>
            <p>
              Verify your email to protect your account and unlock your LinCo
              learning demo.
            </p>
            <ul className={styles["benefit-list"]}>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>Secure account activation</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>One-click email verification</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>Instant access after sign in</span>
              </li>
            </ul>
          </div>

          <div className={styles["verification-preview"]} aria-hidden="true">
            <div className={styles["preview-header"]}>
              <span>Account setup</span>
              <small>Email sent</small>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoMailOpenOutline />
              </span>
              <span>
                <strong>Check your inbox</strong>
                <small>Open the email from LinCo</small>
              </span>
              <i>1</i>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoShieldCheckmarkOutline />
              </span>
              <span>
                <strong>Verify your account</strong>
                <small>Use the secure link inside</small>
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
            <span className={styles["header-kicker"]}>Email verification</span>
            <h1 id="verify-email-title" className={styles.title}>
              Check your inbox
            </h1>
            <p className={styles.description}>
              We sent a secure verification link to
            </p>
          </header>

          <div className={styles["email-card"]}>
            <IoMailOutline aria-hidden="true" />
            <strong>
              {userEmail || "the email address you registered with"}
            </strong>
          </div>

          <div className={styles["instruction-card"]}>
            <IoLockClosedOutline aria-hidden="true" />
            <p>
              Open the email and select <strong>Verify email</strong>. The link
              is unique to your account and may expire for your security.
            </p>
          </div>

          <Link to={PATHS.SIGNIN} className={styles["btn-primary"]}>
            Continue to sign in
            <IoArrowForwardOutline aria-hidden="true" />
          </Link>

          <div className={styles.divider} aria-hidden="true">
            <span>Didn&apos;t get the email?</span>
          </div>

          <div className={styles["resend-section"]}>
            <p>Check your spam folder or request a fresh verification link.</p>
            <button
              type="button"
              className={styles["btn-secondary"]}
              onClick={handleResend}
              disabled={isResending}
            >
              <IoMailOpenOutline aria-hidden="true" />
              {isResending ? "Sending..." : "Resend verification email"}
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
            Back to sign up
          </Link>
        </section>
      </main>
    </div>
  );
};

export default VerifyEmail;
