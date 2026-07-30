import { useState, useRef } from "react";
import {
  IoCloseOutline,
  IoPaperclipOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";

const AddAttachmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    file: null,
  });

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
        title: prev.title || file.name, // استخدام اسم الملف كعنوان افتراضي
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file) return;

    onSubmit({
      id: Date.now().toString(),
      title: formData.title,
      fileName: formData.file.name,
      fileSize: (formData.file.size / 1024).toFixed(1) + " KB",
      fileType: formData.file.type || "document",
      file: formData.file,
    });

    setFormData({ title: "", file: null });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة التابع للون الأصفر */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={`${styles.iconBadge} ${styles.amberBadge}`}>
              <IoPaperclipOutline />
            </div>
            <div>
              <h3>Add Lesson Attachment</h3>
              <p>Upload supplementary files, slides, or resources</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        {/* جسم النموذج */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {/* عنوان الملحق */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <IoDocumentTextOutline /> Attachment Title *
            </label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. Chapter 1 Summary PDF"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* منطقة رفع الملف */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Resource File *</label>
            <div
              className={`${styles.dropzone} ${styles.amberDropzone}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <IoCloudUploadOutline className={styles.amberDropzoneIcon} />
              {formData.file ? (
                <div className={styles.fileSelectedInfo}>
                  <strong style={{ color: "#d97706" }}>
                    {formData.file.name}
                  </strong>
                  <span>{(formData.file.size / 1024).toFixed(1)} KB</span>
                </div>
              ) : (
                <>
                  <p className={styles.dropzoneTitle}>
                    Click or drag file to attach
                  </p>
                  <span className={styles.dropzoneSub}>
                    PDF, ZIP, DOCX, PPTX (Max 50MB)
                  </span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.file}
              className={`${styles.submitBtn} ${styles.amberBtn}`}
            >
              Attach File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttachmentModal;
