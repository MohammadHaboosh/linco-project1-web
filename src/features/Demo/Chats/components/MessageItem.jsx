import {
  IoCreateOutline,
  IoReturnUpBackOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import {
  getSenderInitials,
  getSenderName,
} from "../utils/messageUtils";
import styles from "./Chats.module.css";

const formatMessageTime = (value, language) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return new Intl.DateTimeFormat(
    language,
    isToday
      ? { hour: "numeric", minute: "2-digit" }
      : {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        },
  ).format(date);
};

const Attachment = ({ attachment, type }) => {
  const { t } = useTranslation();

  if (!attachment?.fileUrl) {
    return null;
  }

  if (type === "IMAGE") {
    return (
      <a
        href={attachment.fileUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.imageAttachmentLink}
      >
        <img
          src={attachment.fileUrl}
          alt={attachment.fileName || t("chat-image-attachment")}
          className={styles.imageAttachment}
          loading="lazy"
        />
      </a>
    );
  }

  if (type === "AUDIO") {
    return (
      <audio className={styles.audioAttachment} controls preload="metadata">
        <source src={attachment.fileUrl} type={attachment.mimeType} />
      </audio>
    );
  }

  return (
    <a
      href={attachment.fileUrl}
      target="_blank"
      rel="noreferrer"
      className={styles.fileAttachment}
    >
      {attachment.fileName || t("chat-open-attachment")}
    </a>
  );
};

const MessageItem = ({
  message,
  isMe,
  isPending,
  onReply,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const senderName = getSenderName(message);

  return (
    <article
      className={`${styles.messageRow} ${
        isMe ? styles.rowMe : styles.rowThem
      }`}
      data-message-id={message.id}
    >
      {!isMe && (
        <div className={styles.senderAvatarSmall} aria-hidden="true">
          {message.sender.imagePath ? (
            <img src={message.sender.imagePath} alt="" />
          ) : (
            getSenderInitials(message)
          )}
        </div>
      )}

      <div className={styles.messageContent}>
        {!isMe && <span className={styles.senderName}>{senderName}</span>}

        <div className={styles.messageBubble}>
          {message.replyTo && (
            <div className={styles.replyReference}>
              <span>{t("chat-reply")}</span>
              <p>
                {message.replyTo.content ||
                  t("chat-referenced-message-unavailable")}
              </p>
            </div>
          )}

          {message.isDeleted ? (
            <p className={styles.deletedMessage}>
              {t("chat-message-deleted")}
            </p>
          ) : (
            <>
              {message.content && (
                <p className={styles.messageText}>{message.content}</p>
              )}
              <Attachment
                attachment={message.attachment}
                type={message.type}
              />
            </>
          )}

          <div className={styles.messageMeta}>
            {message.isEdited && !message.isDeleted && (
              <span>{t("chat-edited")}</span>
            )}
            <time dateTime={message.createdAt}>
              {formatMessageTime(message.createdAt, i18n.language)}
            </time>
          </div>
        </div>

        {!message.isDeleted && (
          <div className={styles.messageActions}>
            <button
              type="button"
              onClick={() => onReply(message)}
              disabled={isPending}
              title={t("chat-reply")}
              aria-label={t("chat-reply")}
            >
              <IoReturnUpBackOutline />
            </button>

            {isMe && message.content && (
              <button
                type="button"
                onClick={() => onEdit(message)}
                disabled={isPending}
                title={t("chat-edit-message")}
                aria-label={t("chat-edit-message")}
              >
                <IoCreateOutline />
              </button>
            )}

            {isMe && (
              <button
                type="button"
                onClick={() => onDelete(message)}
                disabled={isPending}
                title={t("chat-delete-message")}
                aria-label={t("chat-delete-message")}
                className={styles.deleteAction}
              >
                <IoTrashOutline />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default MessageItem;

