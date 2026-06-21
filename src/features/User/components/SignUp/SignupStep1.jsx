import { useState } from "react";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import styles from "./Signup.module.css";

const SignupStep1 = ({ formData, onChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

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
      {/* Specifically show the mismatch error here */}
      {errors.passwordMatch && (
        <span className={styles["error-text"]}>{errors.passwordMatch}</span>
      )}

      <div className={styles["divider-container"]}>
        <div className={styles.line}></div>
        <span className={styles["divider-text"]}>OR WITH GOOGLE</span>
        <div className={styles.line}></div>
      </div>

      <button className={styles["btn-google"]}>
        <FcGoogle className={styles["google-icon"]} />
        Continue with Google
      </button>
    </>
  );
};

export default SignupStep1;
