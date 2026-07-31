export const getMessagePreviewText = (message, t) => {
  if (!message) {
    return "";
  }

  if (message.isDeleted) {
    return t("chat-message-deleted");
  }

  const content = String(message.content || "").trim();
  if (content) {
    return content;
  }

  const attachment = message.attachment;
  const fileName = attachment?.fileName || message.fileName;
  if (fileName) {
    return fileName;
  }

  const type = String(message.type || "").toUpperCase();
  const mimeType = attachment?.mimeType || message.mimeType || "";
  const hasAttachment = Boolean(
    attachment ||
      message.fileUrl ||
      ["IMAGE", "AUDIO", "FILE"].includes(type),
  );

  if (!hasAttachment) {
    return "";
  }

  if (type === "IMAGE" || mimeType.startsWith("image/")) {
    return t("chat-image-attachment");
  }

  if (type === "AUDIO" || mimeType.startsWith("audio/")) {
    return t("chat-audio-attachment");
  }

  return t("chat-file-attachment");
};
