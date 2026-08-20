import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { resetPassword } from "../../api/userApi";
import { PATHS } from "../../../../routes/paths";
import styles from "./PasswordReset.module.css";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState("idle"); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  const missingCriteria = [];
  if (password) {
    if (!/.{8,}/.test(password))
      missingCriteria.push(t("auth-password-minimum-length"));
    if (!/[A-Z]/.test(password))
      missingCriteria.push(t("auth-password-uppercase"));
    if (!/[a-z]/.test(password))
      missingCriteria.push(t("auth-password-lowercase"));
    if (!/\d/.test(password))
      missingCriteria.push(t("auth-password-number"));
    if (!/[@$!%*?&]/.test(password))
      missingCriteria.push(t("auth-password-special-character"));
  }

  const requirementsList = new Intl.ListFormat(
    i18n.resolvedLanguage || i18n.language || "en",
    { style: "short", type: "conjunction" },
  ).format(missingCriteria);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage(t("auth-missing-reset-token"));
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setStatus("error");
      setMessage(t("auth-meet-password-requirements"));
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage(t("auth-passwords-do-not-match"));
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await resetPassword(token, password);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(
        error.message || t("auth-reset-password-failed"),
      );
    }
  };

  if (status === "success") {
    return (
      <div className={styles["page-container"]}>
        <div className={styles["card"]}>
          <div
            className={`${styles["icon-wrapper"]} ${styles["completed-icon-wrapper"]}`}
          >
            <IoShieldCheckmarkOutline
              className={`${styles["header-icon"]} ${styles["completed-icon"]}`}
            />
          </div>
          <h1 className={styles["title"]}>{t("auth-password-reset-title")}</h1>
          <p className={styles["subtitle"]}>
            {t(
              "your-password-has-been-successfully-reset-you-can-now-use-your-new-password-to-sign-in",
            )}
          </p>
          <button
            className={styles["btn-primary"]}
            onClick={() => navigate(PATHS.SIGNIN)}
          >
            {t("go-to-sign-in")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["page-container"]}>
      <div className={styles["card"]}>
        <div className={styles["icon-wrapper"]}>
          <IoLockClosedOutline className={styles["header-icon"]} />
        </div>

        <h1 className={styles["title"]}>{t("auth-set-new-password")}</h1>
        <p className={styles["subtitle"]}>
          {t("auth-enter-new-password-below")}
        </p>

        {status === "error" && (
          <div className={`${styles.alert} ${styles.error}`}>{message}</div>
        )}

        <form className={styles["form"]} onSubmit={handleSubmit}>
          <div className={styles["input-wrapper"]}>
            <IoLockClosedOutline className={styles["input-icon"]} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("new-password")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              className={styles["input-field"]}
              disabled={status === "loading"}
              dir="ltr"
            />
            <button
              type="button"
              className={styles["icon-btn"]}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? t("auth-hide-password")
                  : t("auth-show-password")
              }
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          {/* Real-time Feedback Text */}
          <div className={styles["feedback-container"]}>
            {password && missingCriteria.length > 0 && (
              <span className={styles["password-feedback-text"]}>
                {t("auth-password-missing-requirements", {
                  requirements: requirementsList,
                })}
              </span>
            )}
            {password && missingCriteria.length === 0 && (
              <span className={styles["password-success-text"]}>
                <IoCheckmarkCircle className={styles["success-icon"]} />
                {t("auth-secure-password")}
              </span>
            )}
          </div>

          <div className={styles["input-wrapper"]}>
            <IoLockClosedOutline className={styles["input-icon"]} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirm-new-password")}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (status === "error") setStatus("idle"); 
              }}
              className={styles["input-field"]}
              disabled={status === "loading"}
              dir="ltr"
            />
            <button
              type="button"
              className={styles["icon-btn"]}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword
                  ? t("auth-hide-confirm-password")
                  : t("auth-show-confirm-password")
              }
            >
              {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          <button
            type="submit"
            className={styles["btn-primary"]}
            disabled={status === "loading"}
          >
            {status === "loading"
              ? t("auth-resetting-password")
              : t("auth-reset-password")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
