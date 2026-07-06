import { useState } from "react";
import {
  IoImageOutline,
  IoGlobeOutline,
  IoLockClosedOutline,
  IoArrowForwardOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import styles from "./CourseStudio.module.css";
import { useTranslation } from "react-i18next";

const StepOneDetails = ({ courseData, updateCourseData, onNext }) => {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!courseData.tags.includes(tagInput.trim())) {
        updateCourseData("tags", [...courseData.tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const validateAndProceed = () => {
    if (!courseData.title.trim() || !courseData.description.trim()) {
      setError(t("please-fill-in-the-course-title-and-description-to-proceed"));
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2>{t("course-setup")}</h2>
        <p>{t("define-the-core-details-privacy-and-pricing-of-your-course")}</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <div className={styles.cardsWrapper}>
        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>{t("basic-information")}</h3>

          <div className={styles.inputGroup}>
            <label>{t("course-title")} *</label>
            <input
              type="text"
              placeholder="e.g. Master React in 30 Days"
              value={courseData.title}
              onChange={(e) => updateCourseData("title", e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("course-desc")} *</label>
            <textarea
              rows="4"
              placeholder={t("what-will-the-students-learn")}
              value={courseData.description}
              onChange={(e) => updateCourseData("description", e.target.value)}
            ></textarea>
          </div>

          <div className={styles.inputGroup}>
            <label>
              {t("course-tags")} {t("press-enter-to-add")}
            </label>
            <div className={styles.tagsInputContainer}>
              {courseData.tags.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  {tag}{" "}
                  <IoCloseCircleOutline
                    onClick={() =>
                      updateCourseData(
                        "tags",
                        courseData.tags.filter((t) => t !== tag),
                      )
                    }
                    className={styles.removeTagIcon}
                  />
                </span>
              ))}
              <input
                type="text"
                placeholder={t("add-tags")}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className={styles.tagInputField}
              />
            </div>
          </div>

          <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
            <label>{t("course-thumbnail")}</label>
            <div className={styles.uploadBox}>
              <IoImageOutline className={styles.uploadIcon} />
              <span>{t("upload-thumbnail")} (16:9 ratio)</span>
              <small>{t("recommended")} 1280x720 pixels</small>
            </div>
          </div>
        </div>

        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>{t("marketplace-settings")}</h3>

          <div className={styles.privacyBox}>
            <label className={styles.fieldLabel}>{t("access-level")}</label>
            <div className={styles.radioGroup}>
              <label
                className={`${styles.radioCard} ${courseData.privacy === "public" ? styles.activeRadioCard : ""}`}
              >
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={courseData.privacy === "public"}
                  onChange={(e) => updateCourseData("privacy", e.target.value)}
                />
                <div className={styles.radioIcon}>
                  <IoGlobeOutline />
                </div>
                <div className={styles.radioContent}>
                  <h4>{t("public-marketplace")}</h4>
                  <p>{t("visible-to-all-companies-can-be-priced-or-free")}</p>
                </div>
              </label>

              <label
                className={`${styles.radioCard} ${courseData.privacy === "private" ? styles.activeRadioCard : ""}`}
              >
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={courseData.privacy === "private"}
                  onChange={(e) => updateCourseData("privacy", e.target.value)}
                />
                <div className={styles.radioIcon}>
                  <IoLockClosedOutline />
                </div>
                <div className={styles.radioContent}>
                  <h4>{t("private-internal-asset")}</h4>
                  <p>{t("only-visible-within-your-demo-workspace")}</p>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.dividerX}></div>

          <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
            <label>{t("course-price")} (USD)</label>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencySign}>$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={courseData.price}
                onChange={(e) =>
                  updateCourseData("price", parseFloat(e.target.value) || 0)
                }
                className={styles.priceInput}
              />
            </div>
            <small style={{ color: "#64748b", marginTop: "6px" }}>
              {t("leave-at-0-00-to-make-it-free")}
            </small>
          </div>
        </div>
      </div>

      <div className={styles.bottomActions}>
        <button className={styles.proceedBtn} onClick={validateAndProceed}>
          {t("proceed-to-curriculum")} <IoArrowForwardOutline />
        </button>
      </div>
    </div>
  );
};

export default StepOneDetails;
