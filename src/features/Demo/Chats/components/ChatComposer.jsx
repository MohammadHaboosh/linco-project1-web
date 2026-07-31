import { useCallback } from "react";
import { IoAttachOutline, IoCloseOutline, IoSend } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { formatFileSize, getSenderName } from "../utils/messageUtils";
import { getMessagePreviewText } from "../utils/chatPresentationUtils";
import EmojiPicker from "./EmojiPicker";
import styles from "./Chats.module.css";

const ChatComposer = ({
  isConnected,
  draft,
  replyingTo,
  editingMessage,
  selectedAttachment,
  attachmentPreviewUrl,
  attachmentUploadStatus,
  isEmojiPickerOpen,
  isSubmitting,
  isAttachmentUploading,
  canSubmit,
  inputRef,
  fileInputRef,
  setIsEmojiPickerOpen,
  clearSelectedAttachment,
  resetComposer,
  handleDraftChange,
  handleEmojiSelect,
  handleAttachmentChange,
  handleSubmit,
  handleComposerKeyDown,
}) => {
  const { t, i18n } = useTranslation();
  const composerContext = editingMessage || replyingTo;
  const composerContextLabel = editingMessage
    ? t("chat-editing-message")
    : t("chat-replying-to", {
        name: replyingTo ? getSenderName(replyingTo) : "",
      });
  const composerContextPreview = getMessagePreviewText(composerContext, t);
  const closeEmojiPicker = useCallback(
    () => setIsEmojiPickerOpen(false),
    [setIsEmojiPickerOpen],
  );
  const toggleEmojiPicker = useCallback(
    () => setIsEmojiPickerOpen((isOpen) => !isOpen),
    [setIsEmojiPickerOpen],
  );

  return (
    <footer className={styles.inputStickyArea}>
      {composerContext && (
        <div className={styles.composerContext}>
          <div>
            <strong>{composerContextLabel}</strong>
            <span>
              {composerContextPreview ||
                t("chat-referenced-message-unavailable")}
            </span>
          </div>
          <button
            type="button"
            onClick={resetComposer}
            aria-label={t("cancel")}
          >
            <IoCloseOutline />
          </button>
        </div>
      )}

      {selectedAttachment && (
        <div className={styles.selectedAttachment} aria-live="polite">
          {attachmentPreviewUrl ? (
            <img
              src={attachmentPreviewUrl}
              alt=""
              className={styles.selectedAttachmentPreview}
            />
          ) : (
            <span
              className={styles.selectedAttachmentIcon}
              aria-hidden="true"
            >
              <IoAttachOutline />
            </span>
          )}

          <div className={styles.selectedAttachmentDetails}>
            <strong>{selectedAttachment.name}</strong>
            <span
              className={
                isAttachmentUploading
                  ? styles.attachmentUploading
                  : attachmentUploadStatus === "error"
                    ? styles.attachmentUploadError
                    : styles.attachmentReady
              }
            >
              {isAttachmentUploading
                ? t("chat-uploading-attachment")
                : attachmentUploadStatus === "error"
                  ? t("chat-attachment-upload-failed")
                  : t("chat-attachment-ready", {
                      size: formatFileSize(
                        selectedAttachment.size,
                        i18n.language,
                      ),
                    })}
            </span>
          </div>

          <button
            type="button"
            className={styles.removeAttachmentButton}
            onClick={clearSelectedAttachment}
            disabled={isSubmitting || isAttachmentUploading}
            title={t("chat-remove-attachment")}
            aria-label={t("chat-remove-attachment")}
          >
            <IoCloseOutline />
          </button>
        </div>
      )}

      <form className={styles.inputWrapper} onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleAttachmentChange}
          disabled={
            isSubmitting || isAttachmentUploading || Boolean(editingMessage)
          }
        />

        <button
          type="button"
          className={styles.actionIcon}
          onClick={() => fileInputRef.current?.click()}
          disabled={
            isSubmitting || isAttachmentUploading || Boolean(editingMessage)
          }
          title={
            editingMessage
              ? t("chat-edit-attachment-unavailable")
              : t("chat-select-attachment")
          }
          aria-label={
            editingMessage
              ? t("chat-edit-attachment-unavailable")
              : t("chat-select-attachment")
          }
        >
          <IoAttachOutline />
        </button>

        <EmojiPicker
          isOpen={isEmojiPickerOpen}
          disabled={!isConnected || isSubmitting}
          inputRef={inputRef}
          onSelect={handleEmojiSelect}
          onToggle={toggleEmojiPicker}
          onClose={closeEmojiPicker}
        />

        <textarea
          ref={inputRef}
          placeholder={
            isConnected
              ? t("write-your-message")
              : t("chat-waiting-for-connection")
          }
          value={draft}
          onChange={handleDraftChange}
          onKeyDown={handleComposerKeyDown}
          disabled={!isConnected}
          autoComplete="off"
          rows={1}
        />

        <button
          type="submit"
          className={`${styles.sendBtn} ${
            canSubmit ? styles.sendBtnActive : ""
          }`}
          disabled={!canSubmit}
          aria-label={
            editingMessage ? t("chat-save-edit") : t("chat-send-message")
          }
        >
          <IoSend />
        </button>
      </form>
    </footer>
  );
};

export default ChatComposer;
