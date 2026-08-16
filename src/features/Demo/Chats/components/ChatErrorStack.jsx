import { memo } from "react";
import { IoCloseOutline, IoCloudOfflineOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./Chats.module.css";

const ChatErrorStack = ({
  errors,
  actionError,
  attachmentUploadStatus,
  retry,
  retrySelectedAttachment,
  clearActionError,
}) => {
  const { t } = useTranslation();
  const visibleErrors = [...new Set(errors.filter(Boolean))];

  if (visibleErrors.length === 0) {
    return null;
  }

  return (
    <div className={styles.errorStack} role="alert">
      {visibleErrors.map((error) => (
        <div className={styles.errorBanner} key={error}>
          <IoCloudOfflineOutline aria-hidden="true" />
          <span>{t(error)}</span>
          <div className={styles.errorActions}>
            <button
              type="button"
              onClick={
                error === actionError && attachmentUploadStatus === "error"
                  ? retrySelectedAttachment
                  : retry
              }
            >
              {t("try-again")}
            </button>
            {error === actionError && (
              <button
                type="button"
                onClick={clearActionError}
                aria-label={t("close")}
              >
                <IoCloseOutline />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(ChatErrorStack);
