import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRequestRoom } from "../hooks/useRequestRoom.jsx";
import RequestRoomStep1 from "./RequestRoomStep1";
import styles from "./RequestRoom.module.css";

import logoImg from "../../../../public/images/LinCo.png";
import mascotImg from "../../../../public/images/linco-logo.jpg";
import { useTranslation } from "react-i18next";

const RequestRoom = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
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

          <div className={styles["form-card"]}>
            {errors.submit && (
              <div className={styles["server-error-banner"]}>
                {errors.submit}
              </div>
            )}
            <RequestRoomStep1
              formData={formData}
              onChange={handleInputChange}
              onFileChange={handleFileChange}
              errors={errors}
            />
          </div>

          <div className={styles["bottom-actions"]}>
            <button
              type="button"
              className={styles["btn-continue"]}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : t("request-room")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestRoom;
