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
  const { t } = useTranslation();
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

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
    onSubmit({
      id: `temp_lesson_${Date.now()}`,
      title: formData.title,
      description: formData.description,
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
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={`${styles.iconBadge} ${styles.blueBadge}`}>
              <IoVideocamOutline />
            </div>
            <div>
              <h3>{t("add-new-lesson")}</h3>
              <p>{t("upload-video-lecture-and-lesson-details")}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <IoCloseOutline />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{t("lesson-title-0")}</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. Introduction to Authentication"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t("lecture-video-file")}</label>
            <div
              className={styles.dropzone}
              onClick={() => videoInputRef.current?.click()}
            >
              <IoCloudUploadOutline className={styles.dropzoneIcon} />
              {formData.videoFile ? (
                <div className={styles.fileSelectedInfo}>
                  <strong>{formData.videoFile.name}</strong>
                  <span>
                    {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    {formData.duration > 0 && ` • ~${formData.duration} Min`}
                  </span>
                </div>
              ) : (
                <>
                  <p className={styles.dropzoneTitle}>
                    {t("click-or-drag-video-to-upload")}
                  </p>
                  <span className={styles.dropzoneSub}>
                    MP4, WebM or MOV (Max 500MB)
                  </span>
                </>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                hidden
                required
                onChange={handleVideoSelect}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <IoDocumentTextOutline /> {t("lesson-desc")}
            </label>
            <textarea
              className={styles.textarea}
              rows="3"
              placeholder={t(
                "describe-what-trainees-will-learn-in-this-lesson",
              )}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

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
