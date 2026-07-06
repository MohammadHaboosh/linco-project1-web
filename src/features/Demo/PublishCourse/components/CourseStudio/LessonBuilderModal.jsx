import { useState, useEffect } from "react";
import {
  IoCloseOutline,
  IoVideocamOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";
import styles from "./CourseStudio.module.css";
import { useTranslation } from "react-i18next";

const LessonBuilderModal = ({ initialData, onClose, onSave }) => {
  const { t } = useTranslation();
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    videoFile: null,
    pdfs: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    //if (initialData) //setLessonData(initialData);
  }, [initialData]);

  const handleSave = () => {
    if (!lessonData.title.trim())
      return setError(t("lesson-title-is-required"));
    onSave(lessonData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>
            {initialData ? t("edit-video-lesson") : t("add-video-lesson")}
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>
        <div className={styles.modalBody}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          <div className={styles.inputGroup}>
            <label>{t("lesson-title")} *</label>
            <input
              type="text"
              placeholder="e.g. Setting up the environment"
              value={lessonData.title}
              onChange={(e) =>
                setLessonData({ ...lessonData, title: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>{t("lesson-desc")}</label>
            <textarea
              rows="3"
              placeholder={t("what-is-this-lesson-about")}
              value={lessonData.description}
              onChange={(e) =>
                setLessonData({ ...lessonData, description: e.target.value })
              }
            />
          </div>
          <div className={styles.filesGrid}>
            <div className={styles.inputGroup}>
              <label>{t("main-video-file")}</label>
              <div
                className={`${styles.uploadBox} ${lessonData.videoFile ? styles.uploaded : ""}`}
                onClick={() =>
                  setLessonData({ ...lessonData, videoFile: "video.mp4" })
                }
              >
                <IoVideocamOutline className={styles.uploadIcon} />
                <span>
                  {lessonData.videoFile
                    ? t("video-attached")
                    : `${t("upload-video")} (.mp4)`}
                </span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t("supporting-materials")} (PDFs)</label>
              <div
                className={styles.uploadBox}
                onClick={() =>
                  setLessonData({
                    ...lessonData,
                    pdfs: [...lessonData.pdfs, "file.pdf"],
                  })
                }
              >
                <IoCloudUploadOutline className={styles.uploadIcon} />
                <span>{t("upload")} PDFs</span>
                <small>
                  {lessonData.pdfs.length} {t("files")}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t("cancel")}
          </button>
          <button className={styles.saveModalBtn} onClick={handleSave}>
            {t("save-lesson")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonBuilderModal;
