import { useState, useRef } from "react";
import {
  IoCloseOutline,
  IoAttachOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";
import { useTranslation } from "react-i18next";

const AddAttachmentModal = ({ isOpen, onClose, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    file: null,
  });
  const [fileError, setFileError] = useState("");

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const selectFile = (file) => {
    if (file) {
      const supportedExtension = /\.(pdf|zip|doc|docx|ppt|pptx)$/i.test(
        file.name,
      );
      if (!supportedExtension || file.size > 50 * 1024 * 1024) {
        setFileError(t("attachment-invalid-file"));
        setFormData((prev) => ({ ...prev, file: null }));
        return;
      }

      setFileError("");
      setFormData((prev) => ({
        ...prev,
        file: file,
        title: prev.title || file.name,
      }));
    }
  };

  const handleFileSelect = (e) => selectFile(e.target.files?.[0]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    selectFile(e.dataTransfer.files?.[0]);
  };

  const handleClose = () => {
    setFormData({ title: "", file: null });
    setFileError("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file) return;

    onSubmit({
      id: `temp-${Date.now()}`,
      title: formData.title.trim() || formData.file.name,
      fileName: formData.file.name,
      fileSize: t("file-size-kilobytes", {
        formattedSize: new Intl.NumberFormat(
          i18n.resolvedLanguage || i18n.language,
          { maximumFractionDigits: 1 },
        ).format(formData.file.size / 1024),
      }),
      fileType: formData.file.type,
      file: formData.file,
      isNew: true,
    });

    setFormData({ title: "", file: null });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attachment-dialog-title"
        aria-describedby="attachment-dialog-description"
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={`${styles.iconBadge} ${styles.amberBadge}`}>
              <IoAttachOutline aria-hidden="true" />
            </div>
            <div>
              <h3 id="attachment-dialog-title">
                {t("add-lesson-attachment")}
              </h3>
              <p id="attachment-dialog-description">
                {t("add-lesson-attachment-description")}
              </p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            type="button"
            aria-label={t("close-attachment-dialog")}
          >
            <IoCloseOutline aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="attachment-title">
              <IoDocumentTextOutline aria-hidden="true" />
              {t("attachment-title-required")}
            </label>
            <input
              id="attachment-title"
              type="text"
              required
              className={styles.input}
              placeholder={t("attachment-title-placeholder")}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="attachment-file">
              {t("resource-file-required")}
            </label>
            <div
              className={`${styles.dropzone} ${styles.amberDropzone}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label={t("attachment-upload-label")}
            >
              <IoCloudUploadOutline className={styles.amberDropzoneIcon} />
              {formData.file ? (
                <div className={styles.fileSelectedInfo}>
                  <strong className={styles.amberFileName}>
                    {formData.file.name}
                  </strong>
                  <span>
                    {t("file-size-kilobytes", {
                      formattedSize: new Intl.NumberFormat(
                        i18n.resolvedLanguage || i18n.language,
                        { maximumFractionDigits: 1 },
                      ).format(formData.file.size / 1024),
                    })}
                  </span>
                </div>
              ) : (
                <>
                  <p className={styles.dropzoneTitle}>
                    {t("click-or-drag-file-to-attach")}
                  </p>
                  <span className={styles.dropzoneSub}>
                    {t("attachment-file-requirements")}
                  </span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              id="attachment-file"
              type="file"
              accept=".pdf,.zip,.doc,.docx,.ppt,.pptx"
              hidden
              onChange={handleFileSelect}
            />
            {fileError && (
              <p className={styles.fileError} role="alert">
                {fileError}
              </p>
            )}
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
              disabled={!formData.file}
              className={`${styles.submitBtn} ${styles.amberBtn}`}
            >
              {t("attach-file")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttachmentModal;
