import { Link, useNavigate } from "react-router-dom";
import {
  IoAnalyticsOutline,
  IoArrowForwardOutline,
  IoBookOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useSignup } from "../../../../features/User/hooks/useSignup";
import { PATHS } from "../../../../routes/paths.js";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import styles from "./Signup.module.css";

const SignupPage = () => {
  const { t } = useTranslation();
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
      <aside className={styles["left-panel"]}>
        <div className={styles["panel-grid"]} aria-hidden="true" />
        <div className={styles["panel-glow"]} aria-hidden="true" />
        <div className={styles["left-content"]}>
          <Link
            to={PATHS.LANDING}
            className={styles["brand-link"]}
            aria-label="LinCo home"
          >
            <img src="/icons/linco-logo-96.webp" alt="" width="48" height="48" />
            <span>
              <strong>LinCo</strong>
              <small>Link Company</small>
            </span>
          </Link>

          <div className={styles["brand-text"]}>
            <p className={styles.eyebrow}>Build a stronger learning foundation</p>
            <h2>Bring your company&apos;s learning into one demo.</h2>
            <p>
              {t(
                "transform-the-way-your-company-learns-build-a-centralized-hub-for-onboarding-training-and-team-collaboration-0",
              )}
            </p>
            <ul className={styles["benefit-list"]}>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>Dedicated department demos</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>Live and self-paced learning</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>Progress your team can see</span>
              </li>
            </ul>
          </div>

          <div className={styles["workspace-preview"]} aria-hidden="true">
            <div className={styles["preview-header"]}>
              <span>Your learning demo</span>
              <small>Ready</small>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoBookOutline />
              </span>
              <span>
                <strong>Learning paths</strong>
                <small>Organized by department</small>
              </span>
              <i style={{ "--preview-progress": "78%" }} />
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoAnalyticsOutline />
              </span>
              <span>
                <strong>Team progress</strong>
                <small>Clear and measurable</small>
              </span>
              <i style={{ "--preview-progress": "64%" }} />
            </div>
          </div>
        </div>
      </aside>

      <main className={styles["right-panel"]}>
        <div className={styles["form-wrapper"]}>
          <div className={styles.header}>
            <div className={styles["step-heading"]}>
              <span className={styles["header-kicker"]}>Create your account</span>
              <span className={styles["step-count"]}>Step {step} of 3</span>
            </div>
            <h1 className={styles.title}>{t("sign-up")}</h1>
            <p className={styles.subtitle}>
              Join thousands of learners on LinCo.
            </p>
            <div
              className={styles["progress-track"]}
              role="progressbar"
              aria-label="Account setup progress"
              aria-valuemin="1"
              aria-valuemax="3"
              aria-valuenow={step}
            >
              <span style={{ width: `${(step / 3) * 100}%` }} />
            </div>
          </div>

          <form
            className={styles["auth-form"]}
            onSubmit={(event) => {
              event.preventDefault();
              if (step === 3) {
                handleSubmit();
              } else {
                handleNextStep();
              }
            }}
          >
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
                {t("sign-in")}
              </button>
              <button
                type="submit"
                className={styles["btn-continue"]}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Loading..."
                ) : step === 3 ? (
                  "Sign Up"
                ) : (
                  <>
                    {t("continue")} {" "}
                    <IoArrowForwardOutline className={styles["arrow-icon"]} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
