import { useRef } from "react";
import { IoCloudUploadOutline, IoCloseOutline } from "react-icons/io5";
import styles from "../CourseManager.module.css";
import { useTranslation } from "react-i18next";
import { courseManagerApi } from "../../../../api/courseManagerApi";

const GeneralInfoTab = ({ data, onChange }) => {
  const tagsList = data.tags || [];
  const { t } = useTranslation();

  const fileInputRef = useRef(null);

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("📷 [UI] Image File Selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      onChange("imageFile", file);
      onChange("imagePreview", URL.createObjectURL(file));
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
        <h3 className={styles.tabTitle}>
          {t("basic-information", "Basic Information")}
        </h3>
        <p className={styles.tabSubtitle}>
          Manage your course settings, metadata, and visual presentation.
        </p>
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
                <IoCloudUploadOutline className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className={styles.uploadHint}>
                  SVG, PNG, JPG or GIF (max. 2MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className={styles.fileInputHidden}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Course Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. Master React JS 2026"
          />
          <span className={styles.hintText}>
            Keep it short, clear, and descriptive.
          </span>
        </div>

        {/* Visibility */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Visibility</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.selectInput}
              value={data.visibility || "PRIVATE"}
              onChange={(e) => onChange("visibility", e.target.value)}
            >
              <option value="PUBLIC">Public (Available in Library)</option>
              <option value="PRIVATE">Private (Invite Only)</option>
            </select>
          </div>
          <span className={styles.hintText}>
            Determine who can enroll in your course.
          </span>
        </div>

        {/* Tags */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>Course Tags</label>
          <div className={styles.tagsInputContainer}>
            {tagsList.map((tag) => (
              <span key={tag.id} className={styles.tagPill}>
                {tag.name}
                <IoCloseOutline
                  className={styles.tagRemoveIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                />
              </span>
            ))}
            <input
              type="text"
              className={styles.tagInputField}
              placeholder="Add tags and press Enter..."
              onKeyDown={handleTagKeyDown}
            />
          </div>
          <span className={styles.hintText}>
            Tags help trainees find your course faster via search.
          </span>
        </div>

        {/* Description */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>Detailed Description</label>
          <textarea
            className={styles.textarea}
            rows="5"
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe what trainees will learn, prerequisites, and target audience..."
          />
          <span className={styles.hintText}>
            A detailed description increases enrollment rates.
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
