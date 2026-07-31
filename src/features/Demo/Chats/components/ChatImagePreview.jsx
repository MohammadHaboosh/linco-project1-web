import { memo, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./Chats.module.css";

const ChatImagePreview = ({ attachment, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!attachment) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [attachment, onClose]);

  if (!attachment) {
    return null;
  }

  return (
    <div
      className={styles.imagePreviewBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={attachment.fileName || t("chat-image-attachment")}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.imagePreviewDialog}>
        <button
          type="button"
          className={styles.imagePreviewClose}
          onClick={onClose}
          aria-label={t("close")}
          autoFocus
        >
          <IoCloseOutline />
        </button>
        <img
          src={attachment.fileUrl}
          alt={attachment.fileName || t("chat-image-attachment")}
          className={styles.imagePreviewFull}
        />
        {attachment.fileName && (
          <span className={styles.imagePreviewCaption}>
            {attachment.fileName}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(ChatImagePreview);
