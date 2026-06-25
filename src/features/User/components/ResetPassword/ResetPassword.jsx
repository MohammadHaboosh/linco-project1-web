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

const ResetPassword = () => {
  const navigate = useNavigate();
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
    if (!/.{8,}/.test(password)) missingCriteria.push("8+ chars");
    if (!/[A-Z]/.test(password)) missingCriteria.push("uppercase");
    if (!/[a-z]/.test(password)) missingCriteria.push("lowercase");
    if (!/\d/.test(password)) missingCriteria.push("number");
    if (!/[@$!%*?&]/.test(password)) missingCriteria.push("special char");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage(
        "Missing verification token. Please use the link sent to your email.",
      );
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setStatus("error");
      setMessage("Please ensure your password meets all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
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
        error.message || "Failed to reset password. The link might be expired.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className={styles["page-container"]}>
        <div className={styles["card"]}>
          <div
            className={styles["icon-wrapper"]}
            style={{ backgroundColor: "#dcfce7" }}
          >
            <IoShieldCheckmarkOutline
              className={styles["header-icon"]}
              style={{ color: "#166534" }}
            />
          </div>
          <h1 className={styles["title"]}>Password Reset</h1>
          <p className={styles["subtitle"]}>
            Your password has been successfully reset. You can now use your new
            password to log in.
          </p>
          <button
            className={styles["btn-primary"]}
            onClick={() => navigate(PATHS.SIGNIN)}
          >
            Go to Sign In
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

        <h1 className={styles["title"]}>Set New Password</h1>
        <p className={styles["subtitle"]}>
          Please enter your new password below.
        </p>

        {status === "error" && (
          <div className={`${styles.alert} ${styles.error}`}>{message}</div>
        )}

        <form className={styles["form"]} onSubmit={handleSubmit}>
          <div className={styles["input-wrapper"]}>
            <IoLockClosedOutline className={styles["input-icon"]} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              className={styles["input-field"]}
              disabled={status === "loading"}
            />
            <button
              type="button"
              className={styles["icon-btn"]}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          {/* Real-time Feedback Text */}
          <div className={styles["feedback-container"]}>
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
          </div>

          <div className={styles["input-wrapper"]}>
            <IoLockClosedOutline className={styles["input-icon"]} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (status === "error") setStatus("idle"); 
              }}
              className={styles["input-field"]}
              disabled={status === "loading"}
            />
            <button
              type="button"
              className={styles["icon-btn"]}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          <button
            type="submit"
            className={styles["btn-primary"]}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
