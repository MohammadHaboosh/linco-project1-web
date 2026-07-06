import { useState } from "react";
import {
  IoCloseOutline,
  IoImageOutline,
  IoLockClosed,
  IoGlobeOutline,
} from "react-icons/io5";
import styles from "./PublishCourseModal.module.css";
import { useTranslation } from "react-i18next";

const PublishCourseModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{t("publish-new-course")}</h2>
            <p>
              {t(
                "add-a-new-asset-to-your-demo-repository-or-the-public-marketplace",
              )}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.twoColumns}>
            <div className={styles.formSection}>
              <div className={styles.inputGroup}>
                <label>{t("course-title")}</label>
                <input
                  type="text"
                  placeholder="e.g., Advanced React Patterns"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>{t("description")}</label>
                <textarea
                  rows="4"
                  placeholder={t("briefly-describe-what-students-will-learn")}
                ></textarea>
              </div>

              <div className={styles.rowInputs}>
                <div className={styles.inputGroup}>
                  <label>{t("category")}</label>
                  <select>
                    <option>Front-End</option>
                    <option>Back-End</option>
                    <option>UI/UX</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>{t("price")} (USD)</label>
                  <input type="number" placeholder={`0.00 ${t("for-free")}`} />
                </div>
              </div>
            </div>

            {/* Right: Media & Privacy */}
            <div className={styles.formSection}>
              <div className={styles.inputGroup}>
                <label>{t("course-thumbnail")}</label>
                <div className={styles.uploadBox}>
                  <IoImageOutline className={styles.uploadIcon} />
                  <span>{t("click-or-drag-image-to-upload")}</span>
                  <small>1280x720 (16:9) {t("recommended")}</small>
                </div>
              </div>

              <div className={styles.privacySection}>
                <label>{t("access-and-privacy")}</label>
                <div className={styles.privacyCards}>
                  <div
                    className={`${styles.privacyCard} ${!isPrivate ? styles.activePrivacy : ""}`}
                    onClick={() => setIsPrivate(false)}
                  >
                    <IoGlobeOutline className={styles.privacyIcon} />
                    <div className={styles.privacyText}>
                      <h4>{t("public-marketplace")}</h4>
                      <span>
                        {t("visible-and-purchasable-by-other-companies")}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`${styles.privacyCard} ${isPrivate ? styles.activePrivacy : ""}`}
                    onClick={() => setIsPrivate(true)}
                  >
                    <IoLockClosed className={styles.privacyIcon} />
                    <div className={styles.privacyText}>
                      <h4>{t("private-internal-asset")}</h4>
                      <span>
                        {t("only-visible-to-your-demos-section-managers")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t("cancel")}
          </button>
          <button className={styles.publishBtn}>{t("publish-course")}</button>
        </div>
      </div>
    </div>
  );
};

export default PublishCourseModal;
