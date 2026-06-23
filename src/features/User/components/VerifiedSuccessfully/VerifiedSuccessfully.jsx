import { IoCheckmarkCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import styles from "./VerifiedSuccessfully.module.css";

import logoImg from "../../../../assets/icons/celebrating.png";

const VerifiedSuccessfully = () => {
  const navigate = useNavigate();

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

export default VerifiedSuccessfully;
