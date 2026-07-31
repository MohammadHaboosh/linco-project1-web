export const CHAT_ACK_TIMEOUT = 10000;
export const TYPING_EXPIRY = 3000;

export const getAttachmentMessageType = (mimeType) => {
  if (mimeType?.startsWith("image/")) {
    return "IMAGE";
  }

  if (mimeType?.startsWith("audio/")) {
    return "AUDIO";
  }

  return "FILE";
};

export const getAttachmentErrorKey = (error) => {
  if (error?.code === "CHAT_UPLOAD_URL_FAILED") {
    return "chat-attachment-preparation-failed";
  }

  if (error?.code === "CHAT_FILE_UPLOAD_FAILED") {
    return "chat-attachment-upload-failed";
  }

  if (error?.code === "CHAT_ATTACHMENT_NOT_READY") {
    return "chat-attachment-not-ready";
  }

  return "";
};

export const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  if (typeof error?.error === "string") {
    return error.error;
  }

  return fallback;
};
