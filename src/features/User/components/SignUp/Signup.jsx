import { useNavigate } from "react-router-dom";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useSignup } from "../../../../features/User/hooks/useSignup";
import { PATHS } from "../../../../routes/paths.js";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import styles from "./Signup.module.css";

import logoImg from "../../../../../public/images/LinCo.png";
import mascotImg from "../../../../../public/images/linco-logo.jpg";

const SignupPage = () => {
  const navigate = useNavigate();
  const {
    step,
    formData,
    errors,
    serverError,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
  } = useSignup();

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
            <h1 className={styles.title}>Sign Up</h1>
            <p className={styles.subtitle}>
              Join thousands of learners on LinCo..
            </p>
          </div>

          <div className={styles["form-card"]}>
            {step === 1 && (
              <SignupStep1
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
              />
            )}
            {step === 2 && (
              <SignupStep2
                formData={formData}
                onChange={handleInputChange}
                onBack={handlePrevStep}
                errors={errors}
              />
            )}
            {step === 3 && (
              <SignupStep3
                formData={formData}
                onFileChange={handleFileChange}
                onBack={handlePrevStep}
                errors={errors}
              />
            )}
          </div>

          {serverError && (
            <div className={styles["server-error-banner"]}>{serverError}</div>
          )}

          <div className={styles["bottom-actions"]}>
            <button
              type="button"
              className={styles["btn-login"]}
              onClick={() => navigate(PATHS.SIGNIN)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={styles["btn-continue"]}
              onClick={step === 3 ? handleSubmit : handleNextStep}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Loading..."
              ) : step === 3 ? (
                "Sign Up"
              ) : (
                <>
                  Continue{" "}
                  <IoArrowForwardOutline className={styles["arrow-icon"]} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
