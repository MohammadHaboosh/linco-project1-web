import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { forgotPassword } from "../../api/userApi.js";
import { PATHS } from "../../../../routes/paths"; 
import styles from "./PasswordReset.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage(t("auth-enter-email-address"));
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await forgotPassword(email);
      setStatus("success");
      setMessage(t("auth-password-reset-link-sent"));
    } catch (error) {
      setStatus("error");
      setMessage(error.message || t("auth-reset-link-failed"));
    }
  };

  return (
    <div className={styles["page-container"]}>
      <div className={styles["card"]}>
        <div className={styles["icon-wrapper"]}>
          <IoKeyOutline className={styles["header-icon"]} />
        </div>
        
        <h1 className={styles["title"]}>{t("auth-forgot-password-title")}</h1>
        
        {status === "success" ? (
          <>
            <p className={styles["subtitle"]}>
              {t("auth-secure-link-sent-to")} <strong dir="ltr">{email}</strong>.{" "}
              {t("auth-click-link-to-reset-password")}
            </p>
            <div className={`${styles.alert} ${styles.success}`}>
              {message}
            </div>
          </>
        ) : (
          <>
            <p className={styles["subtitle"]}>
              {t("auth-reset-instructions-description")}
            </p>

            {status === "error" && (
              <div className={`${styles.alert} ${styles.error}`}>{message}</div>
            )}

            <form className={styles["form"]} onSubmit={handleSubmit}>
              <div className={styles["input-wrapper"]}>
                <IoMailOutline className={styles["input-icon"]} />
                <input
                  type="email"
                  placeholder={t("auth-enter-your-email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles["input-field"]}
                  disabled={status === "loading"}
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className={styles["btn-primary"]}
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? t("auth-sending")
                  : t("auth-reset-password")}
              </button>
            </form>
          </>
        )}

        <button
          className={styles["btn-text"]}
          onClick={() => navigate(PATHS.SIGNIN)}
        >
          {t("auth-back-to-sign-in")}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
