import { useEffect, useState } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoReloadOutline,
} from "react-icons/io5";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { verifyUserEmail } from "../../api/userApi";
import styles from "./VerifyAccount.module.css";
import logoImg from "../../../../../public/icons/celebrating.png";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "Invalid or missing verification token.",
  );

  useEffect(() => {
    if (!token) return;

    const verifyAccount = async () => {
      try {
        await verifyUserEmail(token);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error.message ||
            "Failed to verify your account. The link might be expired or invalid.",
        );
      }
    };

    verifyAccount();
  }, [token]);

  if (status === "loading") {
    return (
      <div className={styles["page-container"]}>
        <div className={styles["card"]}>
          <IoReloadOutline
            className={styles["success-icon"]}
            style={{
              animation: "spin 2s linear infinite",
              color: "var(--color-linco-navy)",
            }}
          />
          <h1 className={styles["title"]} style={{ marginTop: "20px" }}>
            Verifying...
          </h1>
          <p className={styles["subtitle"]}>
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles["page-container"]}>
        <div
          className={styles["card"]}
          style={{ borderTopColor: "var(--color-linco-accent)" }}
        >
          <div
            className={styles["icon-wrapper"]}
            style={{
              backgroundColor: "var(--color-linco-accent-light)",
              boxShadow: "0 0 20px rgba(159, 18, 57, 0.2)",
            }}
          >
            <IoCloseCircleOutline
              className={styles["success-icon"]}
              style={{ color: "var(--color-linco-accent)" }}
            />
          </div>
          <h1 className={styles["title"]}>Verification Failed</h1>
          <p className={styles["subtitle"]}>{errorMessage}</p>
          <button
            className={styles["btn-primary"]}
            style={{ background: "var(--color-linco-accent)" }}
            onClick={() => navigate("/signup")}
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["page-container"]}>
      <div className={styles["card"]}>
        <img src={logoImg} alt="LinCo Logo" className={styles["logo"]} />
        <div className={styles["icon-wrapper"]}>
          <IoCheckmarkCircle className={styles["success-icon"]} />
        </div>
        <h1 className={styles["title"]}>Email Verified!</h1>
        <p className={styles["subtitle"]}>
          Thank you for verifying your email address. Your LinCo account is now
          active and ready to use.
        </p>
        <button
          className={styles["btn-primary"]}
          onClick={() => navigate("/signin")}
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
};

export default VerifyAccount;
