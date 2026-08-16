import { useCallback, useEffect, useRef, useState } from "react";
import { departmentMessagesApi } from "../api/departmentMessagesApi";
import {
  getAttachmentErrorKey,
  getAttachmentMessageType,
} from "../utils/departmentChatUtils";

export const useDepartmentChatActions = ({
  demoId,
  departmentId,
  contextKey,
  activeContextKeyRef,
  emitWithAcknowledgement,
  setActionError,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [pendingActionId, setPendingActionId] = useState(null);
  const uploadControllerRef = useRef(null);
  const preparedAttachmentRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const resetActionState = async () => {
      await Promise.resolve();
      if (isActive) {
        setIsSending(false);
        setIsUploadingAttachment(false);
        setPendingActionId(null);
      }
    };

    void resetActionState();

    return () => {
      isActive = false;
      uploadControllerRef.current?.abort();
      uploadControllerRef.current = null;
      preparedAttachmentRef.current = null;
    };
  }, [contextKey]);

  const prepareAttachment = useCallback(
    async (file) => {
      const actionContextKey = contextKey;
      if (!file) {
        throw new Error("A file is required.");
      }

      const cachedAttachment = preparedAttachmentRef.current;
      if (cachedAttachment?.file === file) {
        return cachedAttachment.metadata;
      }

      uploadControllerRef.current?.abort();
      const uploadController = new AbortController();
      uploadControllerRef.current = uploadController;
      setIsUploadingAttachment(true);
      setActionError("");

      try {
        const upload = await departmentMessagesApi.requestUploadUrl({
          demoId,
          departmentId,
          fileName: file.name,
          signal: uploadController.signal,
        });

        await departmentMessagesApi.uploadFile({
          uploadUrl: upload.uploadUrl,
          file,
          signal: uploadController.signal,
        });

        if (activeContextKeyRef.current !== actionContextKey) {
          throw new DOMException("The chat context changed.", "AbortError");
        }

        const mimeType = file.type || "application/octet-stream";
        const preparedAttachment = {
          type: getAttachmentMessageType(mimeType),
          fileUrl: upload.cdnUrl,
          fileName: upload.fileName || file.name,
          mimeType,
          fileSize: file.size,
        };
        preparedAttachmentRef.current = {
          file,
          metadata: preparedAttachment,
        };

        return preparedAttachment;
      } catch (error) {
        if (preparedAttachmentRef.current?.file === file) {
          preparedAttachmentRef.current = null;
        }

        if (
          activeContextKeyRef.current === actionContextKey &&
          error.name !== "AbortError"
        ) {
          const attachmentErrorKey = getAttachmentErrorKey(error);
          setActionError(
            attachmentErrorKey ||
              "chat-attachment-upload-failed",
          );
        }
        throw error;
      } finally {
        if (uploadControllerRef.current === uploadController) {
          uploadControllerRef.current = null;
        }

        if (activeContextKeyRef.current === actionContextKey) {
          setIsUploadingAttachment(false);
        }
      }
    },
    [
      activeContextKeyRef,
      contextKey,
      demoId,
      departmentId,
      setActionError,
    ],
  );

  const sendMessage = useCallback(
    async ({ content, replyToId, file }) => {
      const actionContextKey = contextKey;
      const normalizedContent = String(content || "").trim();
      if (!normalizedContent && !file) {
        throw new Error("A message or attachment is required.");
      }

      let preparedAttachment = null;
      if (file) {
        const cachedAttachment = preparedAttachmentRef.current;
        if (cachedAttachment?.file !== file) {
          const error = new Error("The attachment is not ready yet.");
          error.code = "CHAT_ATTACHMENT_NOT_READY";
          setActionError(getAttachmentErrorKey(error));
          throw error;
        }

        preparedAttachment = cachedAttachment.metadata;
      }

      setIsSending(true);
      setActionError("");

      try {
        const response = await emitWithAcknowledgement("sendMessage", {
          type: preparedAttachment?.type || "TEXT",
          ...(normalizedContent ? { content: normalizedContent } : {}),
          ...(replyToId ? { replyToId } : {}),
          ...(preparedAttachment
            ? {
                fileUrl: preparedAttachment.fileUrl,
                fileName: preparedAttachment.fileName,
                mimeType: preparedAttachment.mimeType,
                fileSize: preparedAttachment.fileSize,
              }
            : {}),
        });

        preparedAttachmentRef.current = null;
        return response;
      } catch (error) {
        if (
          activeContextKeyRef.current === actionContextKey &&
          error.name !== "AbortError"
        ) {
          const attachmentErrorKey = getAttachmentErrorKey(error);
          setActionError(
            (currentError) =>
              currentError ||
              attachmentErrorKey ||
              "chat-error-send-message",
          );
        }
        throw error;
      } finally {
        if (activeContextKeyRef.current === actionContextKey) {
          setIsSending(false);
        }
      }
    },
    [
      activeContextKeyRef,
      contextKey,
      emitWithAcknowledgement,
      setActionError,
    ],
  );

  const editMessage = useCallback(
    async (messageId, content) => {
      const actionContextKey = contextKey;
      const normalizedContent = String(content || "").trim();
      if (!normalizedContent) {
        throw new Error("A message cannot be empty.");
      }

      setPendingActionId(messageId);
      setActionError("");

      try {
        return await emitWithAcknowledgement("editMessage", {
          messageId,
          content: normalizedContent,
        });
      } catch (error) {
        if (activeContextKeyRef.current === actionContextKey) {
          setActionError(
            (currentError) =>
              currentError ||
              "chat-error-edit-message",
          );
        }
        throw error;
      } finally {
        if (activeContextKeyRef.current === actionContextKey) {
          setPendingActionId(null);
        }
      }
    },
    [
      activeContextKeyRef,
      contextKey,
      emitWithAcknowledgement,
      setActionError,
    ],
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      const actionContextKey = contextKey;
      setPendingActionId(messageId);
      setActionError("");

      try {
        return await emitWithAcknowledgement("deleteMessage", { messageId });
      } catch (error) {
        if (activeContextKeyRef.current === actionContextKey) {
          setActionError(
            (currentError) =>
              currentError ||
              "chat-error-delete-message",
          );
        }
        throw error;
      } finally {
        if (activeContextKeyRef.current === actionContextKey) {
          setPendingActionId(null);
        }
      }
    },
    [
      activeContextKeyRef,
      contextKey,
      emitWithAcknowledgement,
      setActionError,
    ],
  );

  const clearActionError = useCallback(() => setActionError(""), [
    setActionError,
  ]);

  const discardPreparedAttachment = useCallback((file) => {
    if (!file || preparedAttachmentRef.current?.file === file) {
      preparedAttachmentRef.current = null;
    }
  }, []);

  return {
    isSending,
    isUploadingAttachment,
    pendingActionId,
    prepareAttachment,
    sendMessage,
    editMessage,
    deleteMessage,
    clearActionError,
    discardPreparedAttachment,
  };
};
