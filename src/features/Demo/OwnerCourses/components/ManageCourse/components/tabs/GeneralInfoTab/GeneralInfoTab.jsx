import { useRef } from "react";
import {
  IoCloudUploadOutline,
  IoCloseOutline,
  IoPricetagOutline,
  IoCashOutline,
  IoGlobeOutline,
  IoDocumentTextOutline,
  IoPencilOutline,
} from "react-icons/io5";
import styles from "./GeneralInfoTab.module.css";
import { useTranslation } from "react-i18next";

const GeneralInfoTab = ({ data = {}, onChange }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const tagsList = data.tags || [];

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[UI] Image File Selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      const previewUrl = URL.createObjectURL(file);

      onChange({
        imageFile: file,
        imagePreview: previewUrl,
      });
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      const newTagName = e.target.value.trim();

      const isDuplicate = tagsList.some(
        (tag) =>
          (typeof tag === "object" ? tag.name : tag).toLowerCase() ===
          newTagName.toLowerCase(),
      );

      if (!isDuplicate) {
        onChange("tags", [...tagsList, { name: newTagName }]);
      }
      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    const targetName =
      typeof tagToRemove === "object" ? tagToRemove.name : tagToRemove;
    const updatedTags = tagsList.filter((tag) => {
      const currentName = typeof tag === "object" ? tag.name : tag;
      return currentName !== targetName;
    });
    onChange("tags", updatedTags);
  };

  const currentImageDisplay =
    data.imagePreview ||
    (data.imagePath &&
    data.imagePath !== "default" &&
    data.imagePath !== "qwertyuiop"
      ? data.imagePath
      : null);

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeader}>
        <div className={styles.headerIconWrapper}>
          <IoPencilOutline />
        </div>
        <div>
          <h3 className={styles.tabTitle}>
            {t("basic-information", "Basic Information")}
          </h3>
          <p className={styles.tabSubtitle}>
            Manage your course settings, metadata, pricing, and visual
            thumbnail.
          </p>
        </div>
      </div>

      <div className={styles.formGrid}>
        {/* Cover Image */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>
            Course Thumbnail <span className={styles.required}>*</span>
          </label>

          <div
            className={styles.imageUploadArea}
            onClick={handleTriggerFileInput}
            style={{ cursor: "pointer" }}
          >
            {currentImageDisplay ? (
              <div className={styles.imagePreviewWrapper}>
                <img
                  src={currentImageDisplay}
                  alt="Course Cover"
                  className={styles.previewImage}
                />
                <div className={styles.imageOverlay}>
                  <button type="button" className={styles.changeImageBtn}>
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <div className={styles.uploadIconBadge}>
                  <IoCloudUploadOutline className={styles.uploadIcon} />
                </div>
                <p className={styles.uploadText}>
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className={styles.uploadHint}>
                  PNG, JPG, WEBP or GIF (Recommended resolution: 1280x720)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Title */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>
            Course Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. Master React JS & Modern Web Development"
          />
          <span className={styles.hintText}>
            Keep it clear, concise, and catchy for prospective students.
          </span>
        </div>

        {/* Visibility */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <IoGlobeOutline className={styles.labelIcon} /> Visibility
          </label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.selectInput}
              value={data.visibility || "PRIVATE"}
              onChange={(e) => onChange("visibility", e.target.value)}
            >
              <option value="PUBLIC">Public (Listed in Course Library)</option>
              <option value="PRIVATE">
                Private (Access by Link / Invitation)
              </option>
            </select>
          </div>
          <span className={styles.hintText}>
            Control who can discover and enroll in your course.
          </span>
        </div>

        {/* Price */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <IoCashOutline className={styles.labelIcon} /> Course Price ($)
          </label>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className={`${styles.input} ${styles.priceInput}`}
              value={data.price ?? 0}
              onChange={(e) => onChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
          <span className={styles.hintText}>Set to 0 for a free course.</span>
        </div>

        {/* Tags */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>
            <IoPricetagOutline className={styles.labelIcon} /> Course Tags
          </label>
          <div className={styles.tagsInputContainer}>
            {tagsList.map((tag, idx) => {
              const tagName = typeof tag === "object" ? tag.name : tag;
              return (
                <span key={tag.id || idx} className={styles.tagPill}>
                  {tagName}
                  <IoCloseOutline
                    className={styles.tagRemoveIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag);
                    }}
                  />
                </span>
              );
            })}
            <input
              type="text"
              className={styles.tagInputField}
              placeholder="Type tag and press Enter..."
              onKeyDown={handleTagKeyDown}
            />
          </div>
          <span className={styles.hintText}>
            Press Enter after each tag to help trainees filter your course.
          </span>
        </div>

        {/* Description */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>
            <IoDocumentTextOutline className={styles.labelIcon} /> Detailed
            Description
          </label>
          <textarea
            className={styles.textarea}
            rows="5"
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe what trainees will learn, prerequisites, and the target audience..."
          />
          <span className={styles.hintText}>
            A comprehensive overview helps drive higher enrollment.
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
