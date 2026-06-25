import { useState } from "react";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCheckmarkCircle, // Keep this for the success state
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import styles from "./Signup.module.css";

const SignupStep1 = ({ formData, onChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleGoogleLogin = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${BASE_URL}/authentication/google`;
  };

  // 1. Generate the missing criteria array
  const password = formData.password || "";
  const missingCriteria = [];

  if (password) {
    if (!/.{8,}/.test(password)) missingCriteria.push("8+ chars");
    if (!/[A-Z]/.test(password)) missingCriteria.push("uppercase");
    if (!/[a-z]/.test(password)) missingCriteria.push("lowercase");
    if (!/\d/.test(password)) missingCriteria.push("number");
    if (!/[@$!%*?&]/.test(password)) missingCriteria.push("special char");
  }

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
          placeholder="password"
          value={formData.password}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={togglePassword}
          className={styles["icon-btn"]}
        >
          {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
      </div>

      {/* 2. Compact Real-time Feedback Text */}
      {password && missingCriteria.length > 0 && (
        <span className={styles["password-feedback-text"]}>
          Missing: {missingCriteria.join(", ")}.
        </span>
      )}
      {password && missingCriteria.length === 0 && (
        <span className={styles["password-success-text"]}>
          <IoCheckmarkCircle className={styles["success-icon"]} /> Secure
          password
        </span>
      )}

      {/* Main submission error */}
      {errors.password && (
        <span className={styles["error-text"]}>{errors.password}</span>
      )}

      <div className={styles["input-group"]}>
        <IoLockClosedOutline className={styles["icon-left"]} />
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={toggleConfirmPassword}
          className={styles["icon-btn"]}
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
        <span className={styles["divider-text"]}>OR WITH GOOGLE</span>
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
    </>
  );
};

export default SignupStep1;
