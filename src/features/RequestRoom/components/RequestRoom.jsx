import { useNavigate } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoChevronBackOutline,
} from "react-icons/io5";
import { useRequestRoom } from "../hooks/useRequestRoom.jsx";
import RequestRoomStep1 from "./RequestRoomStep1";
import RequestRoomStep2 from "./RequestRoomStep2";
import styles from "./RequestRoom.module.css";

import logoImg from "../../../../public/images/LinCo.png";
import mascotImg from "../../../../public/images/linco-logo.jpg";
import { useTranslation } from "react-i18next";

const RequestRoom = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {
    step,
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    handlePlanSelect,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
  } = useRequestRoom();

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
              {t('transform-the-way-your-company-learns-build-a-centralized-hub-for-onboarding-training-and-team-collaboration')}
            </p>
          </div>
        </div>
      </div>

      <div className={styles["right-panel"]}>
        <div className={styles["form-wrapper"]}>
          <div className={styles.header}>
            <button
              className={styles["back-nav-btn"]}
              onClick={() => navigate(-1)}
            >
              <IoChevronBackOutline />
            </button>
            <div>
              <h1 className={styles.title}>{t('request-room')}</h1>
              <p className={styles.subtitle}>
                {t('set-up-your-companys-learning-environment')}
              </p>
            </div>
          </div>

          <div className={styles["step-indicator"]}>
            {[1, 2].map((num) => (
              <div key={num} className={styles["step-item"]}>
                <div
                  className={`${styles["step-circle"]} ${step >= num ? styles.active : ""}`}
                >
                  {num}
                </div>
                {num < 2 && (
                  <div
                    className={`${styles["step-line"]} ${step > num ? styles.active : ""}`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <div className={styles["form-card"]}>
            {step === 1 && (
              <RequestRoomStep1
                formData={formData}
                onChange={handleInputChange}
                onFileChange={handleFileChange}
                errors={errors}
              />
            )}
            {step === 2 && (
              <RequestRoomStep2
                formData={formData}
                onPlanSelect={handlePlanSelect}
                errors={errors}
              />
            )}
          </div>

          <div className={styles["bottom-actions"]}>
            <button
              type="button"
              className={styles["btn-back"]}
              onClick={handlePrevStep}
              disabled={step === 1}
              style={{ visibility: step === 1 ? "hidden" : "visible" }}
            >
              <IoArrowBackOutline className={styles["arrow-icon-left"]} /> {t('back')}
            </button>
            <button
              type="button"
              className={styles["btn-continue"]}
              onClick={step === 2 ? handleSubmit : handleNextStep}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : step === 2
                  ? "Proceed to Payment"
                  : "Continue"}
              {step !== 2 && (
                <IoArrowForwardOutline className={styles["arrow-icon"]} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestRoom;
