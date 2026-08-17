import { useEffect, useRef, useState } from "react";
import {
  IoCloudUploadOutline,
  IoCloseOutline,
  IoPricetagOutline,
  IoCashOutline,
  IoGlobeOutline,
  IoDocumentTextOutline,
  IoPencilOutline,
  IoInformationCircleOutline,
  IoImageOutline,
} from "react-icons/io5";
import styles from "./GeneralInfoTab.module.css";
import { useTranslation } from "react-i18next";
import { useAvailableTags } from "../../../../../hooks/useAvailableTags";

const GeneralInfoTab = ({ data = {}, onChange, readOnly = false }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language;
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState("");
  const tagsList = data.tags || [];
  const { availableTags, isLoadingTags, tagsError, retryTags } =
    useAvailableTags(!readOnly);
  const formattedTagCount = new Intl.NumberFormat(
    locale,
  ).format(tagsList.length);
  const formattedPrice = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(Number(data.price) || 0);

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const selectImage = (file) => {
    if (file) {
      const supportedImage = /\.(png|jpe?g|webp|gif)$/i.test(file.name);
      if (!supportedImage) {
        setImageError(t("course-thumbnail-invalid-file"));
        return;
      }

      setImageError("");
      const previewUrl = URL.createObjectURL(file);

      onChange({
        imageFile: file,
        imagePreview: previewUrl,
      });
    }
  };

  const handleImageChange = (e) => selectImage(e.target.files?.[0]);

  const handleImageDrop = (e) => {
    e.preventDefault();
    selectImage(e.dataTransfer.files?.[0]);
  };

  useEffect(
    () => () => {
      if (data.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(data.imagePreview);
      }
    },
    [data.imagePreview],
  );

  const handleTagSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const selectedTagObj = availableTags.find(
      (tag) => String(tag.id) === String(selectedId),
    );
    const isDuplicate = tagsList.some(
      (tag) => String(tag?.id ?? tag) === String(selectedId),
    );

    if (selectedTagObj && !isDuplicate) {
      onChange("tags", [...tagsList, selectedTagObj]);
    }

    e.target.value = "";
  };

  const removeTag = (tagIdToRemove) => {
    const updatedTags = tagsList.filter(
      (tag) => (tag?.id ?? tag) !== tagIdToRemove,
    );
    onChange("tags", updatedTags);
  };

  const currentImageDisplay =
    data.imagePreview ||
    (data.imagePath &&
    data.imagePath !== "default" &&
    data.imagePath !== "qwertyuiop"
      ? data.imagePath
      : null);

  const imageContent = currentImageDisplay ? (
    <div className={styles.imagePreviewWrapper}>
      <img
        src={currentImageDisplay}
        alt={t("course-thumbnail-preview-alt")}
        className={styles.previewImage}
      />
      {!readOnly && (
        <div className={styles.imageOverlay}>
          <span className={styles.changeImageBtn}>{t("change-image")}</span>
        </div>
      )}
    </div>
  ) : (
    <div className={styles.uploadPlaceholder}>
      <div className={styles.uploadIconBadge}>
        {readOnly ? (
          <IoImageOutline className={styles.uploadIcon} aria-hidden="true" />
        ) : (
          <IoCloudUploadOutline
            className={styles.uploadIcon}
            aria-hidden="true"
          />
        )}
      </div>
      <p className={styles.uploadText}>
        {readOnly
          ? t("course-thumbnail-not-available")
          : t("course-thumbnail-upload-instruction")}
      </p>
      {!readOnly && (
        <p className={styles.uploadHint}>
          {t("course-thumbnail-upload-requirements")}
        </p>
      )}
    </div>
  );

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeader}>
        <div className={styles.headerIconWrapper}>
          {readOnly ? <IoInformationCircleOutline /> : <IoPencilOutline />}
        </div>
        <div>
          <h3 className={styles.tabTitle}>
            {t("basic-information")}
          </h3>
          <p className={styles.tabSubtitle}>
            {t(
              readOnly
                ? "course-details-basic-information-description"
                : "course-studio-basic-information-description",
            )}
          </p>
        </div>
      </div>

      <div className={styles.formGrid}>
        {/* Cover Image */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>
            {t("course-thumbnail")} {readOnly ? null : (
              <span className={styles.required}>*</span>
            )}
          </label>

          {readOnly ? (
            <div
              className={`${styles.imageUploadArea} ${styles.readOnlyImage}`}
            >
              {imageContent}
            </div>
          ) : (
            <>
              <button
                type="button"
                className={styles.imageUploadArea}
                onClick={handleTriggerFileInput}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                aria-label={t("course-thumbnail-upload-label")}
              >
                {imageContent}
              </button>
              <input
                ref={fileInputRef}
                className={styles.visuallyHiddenInput}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageChange}
                aria-label={t("course-thumbnail-file-input-label")}
              />
            </>
          )}
          {!readOnly && imageError && (
            <p className={styles.fieldError} role="alert">
              {imageError}
            </p>
          )}
        </div>

        {/* Title */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label
            className={styles.formLabel}
            htmlFor={readOnly ? undefined : "course-title"}
          >
            {t("course-title")} {readOnly ? null : (
              <span className={styles.required}>*</span>
            )}
          </label>
          {readOnly ? (
            <div className={styles.readOnlyValue}>
              {data.title || t("untitled-course")}
            </div>
          ) : (
            <>
              <input
                id="course-title"
                type="text"
                className={styles.input}
                value={data.title || ""}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder={t("course-title-placeholder")}
                required
              />
              <span className={styles.hintText}>{t("course-title-hint")}</span>
            </>
          )}
        </div>

        {/* Visibility */}
        <div className={styles.formGroup}>
          <label
            className={styles.formLabel}
            htmlFor={readOnly ? undefined : "course-visibility"}
          >
            <IoGlobeOutline className={styles.labelIcon} aria-hidden="true" />
            {t("visibility")}
          </label>
          {readOnly ? (
            <div className={styles.readOnlyValue}>
              {t(
                data.visibility === "PUBLIC"
                  ? "course-visibility-public"
                  : "course-visibility-private",
              )}
            </div>
          ) : (
            <>
              <div className={styles.selectWrapper}>
                <select
                  id="course-visibility"
                  className={styles.selectInput}
                  value={data.visibility || "PRIVATE"}
                  onChange={(e) => onChange("visibility", e.target.value)}
                >
                  <option value="PUBLIC">
                    {t("course-visibility-public")}
                  </option>
                  <option value="PRIVATE">
                    {t("course-visibility-private")}
                  </option>
                </select>
              </div>
              <span className={styles.hintText}>
                {t("course-visibility-hint")}
              </span>
            </>
          )}
        </div>

        {/* Price */}
        <div className={styles.formGroup}>
          <label
            className={styles.formLabel}
            htmlFor={readOnly ? undefined : "course-price"}
          >
            <IoCashOutline className={styles.labelIcon} aria-hidden="true" />
            {t("course-price-usd")}
          </label>
          {readOnly ? (
            <div className={styles.readOnlyValue} dir="ltr">
              {t("usd-currency-symbol")} {formattedPrice}
            </div>
          ) : (
            <>
              <div className={styles.priceInputWrapper}>
                <span className={styles.currencySymbol} aria-hidden="true">
                  {t("usd-currency-symbol")}
                </span>
                <input
                  id="course-price"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${styles.input} ${styles.priceInput}`}
                  value={data.price ?? 0}
                  onChange={(e) => onChange("price", e.target.value)}
                  placeholder={t("course-price-placeholder")}
                  inputMode="decimal"
                  dir="ltr"
                />
              </div>
              <span className={styles.hintText}>{t("course-price-hint")}</span>
            </>
          )}
        </div>

        {/* Tags */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label
            className={styles.formLabel}
            htmlFor={readOnly ? undefined : "course-tags"}
          >
            <IoPricetagOutline
              className={styles.labelIcon}
              aria-hidden="true"
            />
            {t("course-tags")}
          </label>
          <div
            className={`${styles.tagsInputContainer} ${readOnly ? styles.readOnlyTags : ""}`}
          >
            {tagsList.length === 0 && readOnly && (
              <span className={styles.noTags}>{t("no-course-tags")}</span>
            )}
            {tagsList.map((tag, idx) => {
              const tagId = tag?.id ?? tag;
              const tagName = tag?.name ?? String(tag ?? "");

              return (
                <span key={tagId || idx} className={styles.tagPill}>
                  {tagName}
                  {!readOnly && (
                    <button
                      type="button"
                      className={styles.tagRemoveBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tagId);
                      }}
                      aria-label={t("remove-tag", { tagName })}
                    >
                      <IoCloseOutline aria-hidden="true" />
                    </button>
                  )}
                </span>
              );
            })}

            {!readOnly && (
              <select
                id="course-tags"
                className={styles.tagInputField}
                onChange={handleTagSelect}
                defaultValue=""
                disabled={isLoadingTags || tagsError}
                aria-busy={isLoadingTags}
              >
                <option value="" disabled>
                  {isLoadingTags ? t("loading-tags") : t("select-tag-to-add")}
                </option>
                {availableTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {!readOnly && tagsError && (
            <div className={styles.inlineError} role="alert">
              <span>{t("course-tags-load-failed")}</span>
              <button type="button" onClick={retryTags}>
                {t("retry")}
              </button>
            </div>
          )}
          {!readOnly && (
            <span className={styles.hintText}>{t("course-tags-hint")}</span>
          )}
          <span className={styles.selectionStatus} aria-live="polite">
            {t("selected-tag-count", {
              count: tagsList.length,
              formattedCount: formattedTagCount,
            })}
          </span>
        </div>

        {/* Description */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label
            className={styles.formLabel}
            htmlFor={readOnly ? undefined : "course-description"}
          >
            <IoDocumentTextOutline
              className={styles.labelIcon}
              aria-hidden="true"
            />
            {t("detailed-description")}
          </label>
          {readOnly ? (
            <p className={`${styles.readOnlyValue} ${styles.readOnlyDescription}`}>
              {data.description || t("course-description-not-available")}
            </p>
          ) : (
            <>
              <textarea
                id="course-description"
                className={styles.textarea}
                rows="5"
                value={data.description || ""}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder={t("course-description-placeholder")}
                required
              />
              <span className={styles.hintText}>
                {t("course-description-hint")}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
