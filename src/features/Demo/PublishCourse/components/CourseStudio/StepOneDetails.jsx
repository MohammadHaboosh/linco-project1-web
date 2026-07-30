import { useState, useRef } from "react";
import {
  IoGlobeOutline,
  IoLockClosedOutline,
  IoArrowForwardOutline,
  IoCloseCircleOutline,
  IoCloudUploadOutline,
  IoTrashOutline,
} from "react-icons/io5";
import styles from "./StepOneDetails.module.css";
import { useTranslation } from "react-i18next";

const StepOneDetails = ({
  courseData,
  updateCourseData,
  onNext,
  isCreating,
}) => {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!courseData.tags.includes(tagInput.trim())) {
        updateCourseData("tags", [...courseData.tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    updateCourseData(
      "tags",
      courseData.tags.filter((t) => t !== tagToRemove),
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      updateCourseData("thumbnail", file);
      const previewUrl = URL.createObjectURL(file);
      updateCourseData("imagePreview", previewUrl);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    updateCourseData("thumbnail", null);
    updateCourseData("imagePreview", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateAndProceed = async () => {
    if (!courseData.title.trim() || !courseData.description.trim()) {
      setError(t("please-fill-in-the-course-title-and-description-to-proceed"));
      return;
    }
    setError("");

    try {
      await onNext();
    } catch (err) {
      setError(
        err.message || "Error occurred while proceeding to the next step.",
      );
    }
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
              placeholder="e.g. Master React & Modern Web Development"
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
              {t("course-tags")}{" "}
              <small style={{ color: "#64748b" }}>
                ({t("press-enter-to-add")})
              </small>
            </label>
            <div className={styles.tagsInputContainer}>
              {courseData.tags.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  {tag}
                  <IoCloseCircleOutline
                    onClick={() => handleRemoveTag(tag)}
                    className={styles.removeTagIcon}
                  />
                </span>
              ))}
              <input
                type="text"
                placeholder={courseData.tags.length === 0 ? t("add-tags") : ""}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className={styles.tagInputField}
              />
            </div>
          </div>

          <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
            <label>{t("course-thumbnail")}</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />

            {courseData.imagePreview || courseData.thumbnail ? (
              <div
                className={`${styles.uploadBox} ${styles.uploaded}`}
                style={{ padding: "15px", position: "relative" }}
              >
                <img
                  src={
                    courseData.imagePreview ||
                    (typeof courseData.thumbnail === "string"
                      ? courseData.thumbnail
                      : "")
                  }
                  alt="Thumbnail Preview"
                  style={{
                    maxHeight: "180px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.iconBtnDanger}
                  style={{
                    position: "absolute",
                    top: "25px",
                    right: "25px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  title="Remove Image"
                >
                  <IoTrashOutline />
                </button>
              </div>
            ) : (
              <div
                className={styles.uploadBox}
                onClick={() => fileInputRef.current?.click()}
              >
                <IoCloudUploadOutline className={styles.uploadIcon} />
                <span>{t("upload-thumbnail")} (16:9 ratio)</span>
                <small>{t("recommended")} 1280x720 pixels</small>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>{t("marketplace-settings")}</h3>

          <div className={styles.privacyBox}>
            <label className={styles.fieldLabel}>{t("access-level")}</label>
            <div className={styles.radioGroup}>
              <label
                className={`${styles.radioCard} ${
                  courseData.privacy === "public" ? styles.activeRadioCard : ""
                }`}
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
                className={`${styles.radioCard} ${
                  courseData.privacy === "private" ? styles.activeRadioCard : ""
                }`}
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
            <small
              style={{ color: "#64748b", marginTop: "8px", display: "block" }}
            >
              {t("leave-at-0-00-to-make-it-free")}
            </small>
          </div>
        </div>
      </div>

      <div className={styles.bottomActions}>
        <button
          className={styles.proceedBtn}
          onClick={validateAndProceed}
          disabled={isCreating}
        >
          {t("proceed-to-curriculum")} <IoArrowForwardOutline />
        </button>
      </div>
    </div>
  );
};

export default StepOneDetails;
