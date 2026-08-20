import { useEffect, useState } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoReloadOutline,
} from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { verifyUserEmail } from "../../api/userApi";
import { PATHS } from "../../../../routes/paths.js";
import styles from "./VerifyAccount.module.css";
import logoImg from "../../../../../public/icons/celebrating.png";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verifyAccount = async () => {
      try {
        await verifyUserEmail(token);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(error.message || "");
      }
    };

    verifyAccount();
  }, [token]);

  if (status === "loading") {
    return (
      <div className={styles["page-container"]}>
        <div className={styles["card"]}>
          <IoReloadOutline
            className={`${styles["success-icon"]} ${styles["loading-icon"]}`}
          />
          <h1 className={styles["title"]} style={{ marginTop: "20px" }}>
            {t("auth-verifying")}
          </h1>
          <p className={styles["subtitle"]}>
            {t("auth-verifying-email-address")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles["page-container"]}>
        <div className={`${styles.card} ${styles["error-card"]}`}>
          <div
            className={`${styles["icon-wrapper"]} ${styles["error-icon-wrapper"]}`}
          >
            <IoCloseCircleOutline
              className={`${styles["success-icon"]} ${styles["error-icon"]}`}
            />
          </div>
          <h1 className={styles["title"]}>{t("auth-verification-failed")}</h1>
          <p className={styles["subtitle"]}>
            {errorMessage ||
              (token
                ? t("auth-account-verification-failed")
                : t("auth-invalid-verification-token"))}
          </p>
          <button
            className={`${styles["btn-primary"]} ${styles["error-button"]}`}
            onClick={() => navigate(PATHS.SIGNUP)}
          >
            {t("auth-back-to-sign-up")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["page-container"]}>
      <div className={styles["card"]}>
        <img src={logoImg} alt={t("auth-linco-logo")} className={styles["logo"]} />
        <div className={styles["icon-wrapper"]}>
          <IoCheckmarkCircle className={styles["success-icon"]} />
        </div>
        <h1 className={styles["title"]}>{t("auth-email-verified")}</h1>
        <p className={styles["subtitle"]}>
          {t("auth-email-verified-description")}
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
};

export default VerifyAccount;
