import { useState, useRef } from "react";
import {
  IoCloseOutline,
  IoVideocamOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";

const AddLessonModal = ({ isOpen, onClose, onSubmit }) => {
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
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        videoFile: file,
        videoUrl: URL.createObjectURL(file),
      }));
    }
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
              <h3>Add New Lesson</h3>
              <p>Upload video lecture and lesson details</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <IoCloseOutline />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.gridTwoCols}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Lesson Title *</label>
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
              <label className={styles.label}>
                <IoTimeOutline /> Duration (Minutes / Seconds) *
              </label>
              <input
                type="number"
                min="1"
                required
                className={styles.input}
                placeholder="e.g. 45"
                value={formData.duration || ""}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Lecture Video File *</label>
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
                  </span>
                </div>
              ) : (
                <>
                  <p className={styles.dropzoneTitle}>
                    Click or drag video to upload
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
                onChange={handleVideoSelect}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <IoDocumentTextOutline /> Lesson Description
            </label>
            <textarea
              className={styles.textarea}
              rows="3"
              placeholder="Describe what trainees will learn in this lesson..."
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
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.submitBtn} ${styles.blueBtn}`}
            >
              Create Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;
