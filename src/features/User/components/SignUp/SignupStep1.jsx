import { useState } from "react";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import styles from "./Signup.module.css";

const SignupStep1 = ({ formData, onChange, errors }) => {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleGoogleLogin = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${BASE_URL}/authentication/google`;
  };

  const password = formData.password || "";
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

  return (
    <>
      <div className={styles["input-group"]}>
        <IoMailOutline className={styles["icon-left"]} />
        <input
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={onChange}
          autoComplete="email"
          dir="ltr"
        />
      </div>
      {errors.email && (
        <span className={styles["error-text"]}>{errors.email}</span>
      )}

      <div className={styles["input-group"]}>
        <IoLockClosedOutline className={styles["icon-left"]} />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder={t("auth-password")}
          value={formData.password}
          onChange={onChange}
          autoComplete="new-password"
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
      </div>

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

      {errors.password && (
        <span className={styles["error-text"]}>{errors.password}</span>
      )}

      <div className={styles["input-group"]}>
        <IoLockClosedOutline className={styles["icon-left"]} />
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder={t("auth-confirm-password")}
          value={formData.confirmPassword}
          onChange={onChange}
          autoComplete="new-password"
          dir="ltr"
        />
        <button
          type="button"
          onClick={toggleConfirmPassword}
          className={styles["icon-btn"]}
          aria-label={
            showConfirmPassword
              ? t("auth-hide-confirm-password")
              : t("auth-show-confirm-password")
          }
        >
          {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
      </div>
      {errors.confirmPassword && (
        <span className={styles["error-text"]}>{errors.confirmPassword}</span>
      )}
      {errors.passwordMatch && (
        <span className={styles["error-text"]}>{errors.passwordMatch}</span>
      )}

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
    </>
  );
};

export default SignupStep1;
