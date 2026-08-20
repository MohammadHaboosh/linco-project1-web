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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const numberFormatter = new Intl.NumberFormat(
    i18n.resolvedLanguage || i18n.language || "en",
  );
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
            aria-label={t("auth-linco-home")}
          >
            <img src="/icons/linco-logo-96.webp" alt="" width="48" height="48" />
            <span>
              <strong>{t("linco-brand")}</strong>
              <small>{t("link-company")}</small>
            </span>
          </Link>

          <div className={styles["brand-text"]}>
            <p className={styles.eyebrow}>{t("auth-signup-eyebrow")}</p>
            <h2>{t("auth-signup-hero-title")}</h2>
            <p>
              {t(
                "transform-the-way-your-company-learns-build-a-centralized-hub-for-onboarding-training-and-team-collaboration-0",
              )}
            </p>
            <ul className={styles["benefit-list"]}>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-benefit-department-demos")}</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-benefit-flexible-learning")}</span>
              </li>
              <li>
                <IoCheckmarkCircle aria-hidden="true" />
                <span>{t("auth-benefit-visible-progress")}</span>
              </li>
            </ul>
          </div>

          <div className={styles["workspace-preview"]} aria-hidden="true">
            <div className={styles["preview-header"]}>
              <span>{t("auth-your-learning-demo")}</span>
              <small>{t("auth-ready")}</small>
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoBookOutline />
              </span>
              <span>
                <strong>{t("auth-learning-paths")}</strong>
                <small>{t("auth-organized-by-department")}</small>
              </span>
              <i style={{ "--preview-progress": "78%" }} />
            </div>
            <div className={styles["preview-row"]}>
              <span className={styles["preview-icon"]}>
                <IoAnalyticsOutline />
              </span>
              <span>
                <strong>{t("auth-team-progress")}</strong>
                <small>{t("auth-clear-and-measurable")}</small>
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
              <span className={styles["header-kicker"]}>
                {t("create-account")}
              </span>
              <span className={styles["step-count"]}>
                {t("auth-step-of", {
                  step: numberFormatter.format(step),
                  total: numberFormatter.format(3),
                })}
              </span>
            </div>
            <h1 className={styles.title}>{t("sign-up")}</h1>
            <p className={styles.subtitle}>
              {t("auth-join-linco-learners")}
            </p>
            <div
              className={styles["progress-track"]}
              role="progressbar"
              aria-label={t("auth-account-setup-progress")}
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
                  t("loading")
                ) : step === 3 ? (
                  t("sign-up")
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
