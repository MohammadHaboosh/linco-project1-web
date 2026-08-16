import { useState, useRef } from "react";
import {
  IoCloseOutline,
  IoVideocamOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";
import { useTranslation } from "react-i18next";

const AddLessonModal = ({ isOpen, onClose, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 0,
    order: 1,
    videoFile: null,
    videoUrl: "",
  });

  const videoInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectVideo = (file) => {
    if (!file) return;
    const supportedVideo = /\.(mp4|webm|mov)$/i.test(file.name);
    if (!supportedVideo || file.size > 500 * 1024 * 1024) {
      setFormData((prev) => ({
        ...prev,
        videoFile: null,
        duration: 0,
      }));
      alert(t("lesson-video-invalid-file"));
      return;
    }

    setFormData((prev) => ({ ...prev, videoFile: file }));

    const videoUrl = URL.createObjectURL(file);
    const videoElement = document.createElement("video");

    videoElement.addEventListener("loadedmetadata", () => {
      const durationInSeconds = videoElement.duration;
      const durationInMinutes = Math.ceil(durationInSeconds / 60);

      setFormData((prev) => ({
        ...prev,
        duration: durationInMinutes,
      }));

      URL.revokeObjectURL(videoUrl);
    });

    videoElement.src = videoUrl;
  };

  const handleVideoSelect = (e) => selectVideo(e.target.files?.[0]);

  const handleVideoDrop = (e) => {
    e.preventDefault();
    selectVideo(e.dataTransfer.files?.[0]);
  };

  const resetForm = () => {
    if (formData.videoUrl && formData.videoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(formData.videoUrl);
    }
    setFormData({
      title: "",
      description: "",
      duration: 0,
      order: 1,
      videoFile: null,
      videoUrl: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.videoFile) {
      alert(t("lesson-video-required"));
      return;
    }

    if (!formData.description.trim()) {
      alert(t("lesson-description-required"));
      return;
    }

    onSubmit({
      id: `temp_lesson_${Date.now()}`,
      title: formData.title,
      description: formData.description.trim(),
      duration: Number(formData.duration) || 0,
      videoFile: formData.videoFile,
      videoUrl: formData.videoUrl,
      isNew: true,
      attachments: [],
    });

    resetForm();
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={`${styles.modalContainer} ${styles.largeModal}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-lesson-title"
        aria-describedby="add-lesson-description"
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={`${styles.iconBadge} ${styles.blueBadge}`}>
              <IoVideocamOutline aria-hidden="true" />
            </div>
            <div>
              <h3 id="add-lesson-title">{t("add-new-lesson")}</h3>
              <p id="add-lesson-description">
                {t("upload-video-lecture-and-lesson-details")}
              </p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            type="button"
            onClick={handleClose}
            aria-label={t("close-add-lesson-dialog")}
          >
            <IoCloseOutline aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="new-lesson-title">
              {t("lesson-title-required")}
            </label>
            <input
              id="new-lesson-title"
              type="text"
              required
              className={styles.input}
              placeholder={t("lesson-title-placeholder")}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="new-lesson-video">
              {t("lecture-video-file")}
            </label>
            <div
              className={styles.dropzone}
              onClick={() => videoInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleVideoDrop}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  videoInputRef.current?.click();
                }
              }}
              aria-label={t("video-upload-label")}
            >
              <IoCloudUploadOutline
                className={styles.dropzoneIcon}
                aria-hidden="true"
              />
              {formData.videoFile ? (
                <div className={styles.fileSelectedInfo}>
                  <strong>{formData.videoFile.name}</strong>
                  <span>
                    {t("selected-video-details", {
                      formattedSize: new Intl.NumberFormat(
                        i18n.resolvedLanguage || i18n.language,
                        { maximumFractionDigits: 2 },
                      ).format(formData.videoFile.size / (1024 * 1024)),
                      formattedDuration: new Intl.NumberFormat(
                        i18n.resolvedLanguage || i18n.language,
                      ).format(formData.duration),
                    })}
                  </span>
                </div>
              ) : (
                <>
                  <p className={styles.dropzoneTitle}>
                    {t("click-or-drag-video-to-upload")}
                  </p>
                  <span className={styles.dropzoneSub}>
                    {t("mp4-webm-mov-max-500mb")}
                  </span>
                </>
              )}
            </div>
            <input
              ref={videoInputRef}
              id="new-lesson-video"
              type="file"
              accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
              hidden
              onChange={handleVideoSelect}
              aria-required="true"
            />
          </div>

          <label className={styles.label} htmlFor="new-lesson-description">
            <IoDocumentTextOutline aria-hidden="true" />
            {t("lesson-description-required-label")}
          </label>
          <textarea
            id="new-lesson-description"
            required
            className={styles.textarea}
            rows="3"
            placeholder={t("describe-what-trainees-will-learn-in-this-lesson")}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className={`${styles.submitBtn} ${styles.blueBtn}`}
            >
              {t("create-lesson")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;
