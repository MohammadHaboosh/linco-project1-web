import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { forgotPassword } from "../../api/userApi.js";
import { PATHS } from "../../../../routes/paths"; 
import styles from "./PasswordReset.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await forgotPassword(email);
      setStatus("success");
      setMessage("Password reset link sent! Please check your email inbox.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className={styles["page-container"]}>
      <div className={styles["card"]}>
        <div className={styles["icon-wrapper"]}>
          <IoKeyOutline className={styles["header-icon"]} />
        </div>
        
        <h1 className={styles["title"]}>Forgot Password?</h1>
        
        {status === "success" ? (
          <>
            <p className={styles["subtitle"]}>
              We've sent a secure link to <strong>{email}</strong>. Click the link to reset your password.
            </p>
            <div className={`${styles.alert} ${styles.success}`}>
              {message}
            </div>
          </>
        ) : (
          <>
            <p className={styles["subtitle"]}>
              No worries, we'll send you reset instructions.
            </p>

            {status === "error" && (
              <div className={`${styles.alert} ${styles.error}`}>{message}</div>
            )}

            <form className={styles["form"]} onSubmit={handleSubmit}>
              <div className={styles["input-wrapper"]}>
                <IoMailOutline className={styles["input-icon"]} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles["input-field"]}
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                className={styles["btn-primary"]}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <button
          className={styles["btn-text"]}
          onClick={() => navigate(PATHS.SIGNIN)}
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;