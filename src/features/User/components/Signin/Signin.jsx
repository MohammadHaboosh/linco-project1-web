import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useSignin } from "../../hooks/useSignin.jsx";
import { PATHS } from "../../../../routes/paths.js";
import styles from "./Signin.module.css";

import logoImg from "../../../../../public/images/LinCo.png";
import mascotImg from "../../../../../public/images/linco-logo.jpg";

const Signin = () => {
  const navigate = useNavigate();
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
  } = useSignin();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleGoogleLogin = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${BASE_URL}/authentication/google`;
  };

  return (
    <div className={styles["page-container"]}>
      <div className={styles["left-panel"]}>
        <div className={styles["left-content"]}>
          <div className={styles["logo-container"]}>
            <img src={logoImg} alt="LinCo Logo" className={styles.logo} />
          </div>
          <div className={styles["mascot-box"]}>
            <img src={mascotImg} alt="LinCo Mascot" className={styles.mascot} />
          </div>
          <div className={styles["brand-text"]}>
            <h2>
              <strong>LinCo..</strong> Link Company,
            </h2>
            <p>
              dfshehbfigfbeuw uewh fiuw eiufwiu fhf iuewhiuf hewfiuh ewiuhfiu
              ewhifuhweifh iweh fiuewhif
            </p>
          </div>
        </div>
      </div>

      <div className={styles["right-panel"]}>
        <div className={styles["form-wrapper"]}>
          <div className={styles.header}>
            <h1 className={styles.title}>Sign In</h1>
            <p className={styles.subtitle}>
              Welcome back..
              <br />
              sign in to continue your learning journey
            </p>
          </div>

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
              />
              <button
                type="button"
                onClick={togglePassword}
                className={styles["icon-btn"]}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
              {errors.password && (
                <span
                  className={styles["error-text"]}
                  style={{ bottom: "-20px", left: "15px" }}
                >
                  {errors.password}
                </span>
              )}
            </div>

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

            <div className={styles["forgot-password"]}>
              <span>Forget password ? </span>
              <span
                onClick={() => navigate(PATHS.FORGOT_PASSWORD)}
                className={styles["forgot-link"]}
                style={{ cursor: "pointer" }}
              >
                Yes
              </span>
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
                    {isResending ? "Sending..." : "Resend Verification Email"}
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
              type="button"
              className={styles["btn-primary"]}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
