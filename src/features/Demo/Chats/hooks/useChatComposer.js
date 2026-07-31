import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const TYPING_IDLE_DELAY = 1500;
const COMPOSER_MAX_HEIGHT = 120;

export const useChatComposer = ({
  isConnected,
  isSending,
  isUploadingAttachment,
  pendingActionId,
  sendMessage,
  editMessage,
  deleteMessage,
  sendTypingStatus,
  clearActionError,
  discardPreparedAttachment,
  prepareAttachment,
}) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState("");
  const [attachmentUploadStatus, setAttachmentUploadStatus] = useState("idle");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const selectedAttachmentRef = useRef(null);
  const attachmentPreviewUrlRef = useRef("");
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const resizeComposer = useCallback((composer) => {
    if (!composer) {
      return;
    }

    composer.style.height = "auto";
    composer.style.height = `${Math.min(
      composer.scrollHeight,
      COMPOSER_MAX_HEIGHT,
    )}px`;
  }, []);

  const clearSelectedAttachment = useCallback(() => {
    discardPreparedAttachment(selectedAttachmentRef.current);
    selectedAttachmentRef.current = null;
    clearActionError();

    if (attachmentPreviewUrlRef.current) {
      URL.revokeObjectURL(attachmentPreviewUrlRef.current);
      attachmentPreviewUrlRef.current = "";
    }

    setSelectedAttachment(null);
    setAttachmentPreviewUrl("");
    setAttachmentUploadStatus("idle");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [clearActionError, discardPreparedAttachment]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTypingStatus(false);
    }
  }, [sendTypingStatus]);

  useEffect(
    () => () => {
      stopTyping();

      if (attachmentPreviewUrlRef.current) {
        URL.revokeObjectURL(attachmentPreviewUrlRef.current);
        attachmentPreviewUrlRef.current = "";
      }
    },
    [stopTyping],
  );

  useEffect(() => {
    if (!isConnected) {
      stopTyping();
    }
  }, [isConnected, stopTyping]);

  const updateTypingActivity = useCallback(
    (nextDraft) => {
      if (editingMessage || !isConnected || !nextDraft.trim()) {
        stopTyping();
        return;
      }

      if (!isTypingRef.current) {
        isTypingRef.current = true;
        sendTypingStatus(true);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(stopTyping, TYPING_IDLE_DELAY);
    },
    [editingMessage, isConnected, sendTypingStatus, stopTyping],
  );

  const handleDraftChange = useCallback(
    (event) => {
      const nextDraft = event.target.value;
      setDraft(nextDraft);
      resizeComposer(event.target);
      updateTypingActivity(nextDraft);
    },
    [resizeComposer, updateTypingActivity],
  );

  const handleEmojiSelect = useCallback(
    (emoji) => {
      const composer = inputRef.current;
      const selectionStart = composer?.selectionStart ?? draft.length;
      const selectionEnd = composer?.selectionEnd ?? draft.length;
      const nextDraft = `${draft.slice(0, selectionStart)}${emoji}${draft.slice(
        selectionEnd,
      )}`;
      const nextCaretPosition = selectionStart + emoji.length;

      setDraft(nextDraft);
      updateTypingActivity(nextDraft);

      requestAnimationFrame(() => {
        if (!inputRef.current) {
          return;
        }

        inputRef.current.focus();
        inputRef.current.setSelectionRange(
          nextCaretPosition,
          nextCaretPosition,
        );
        resizeComposer(inputRef.current);
      });
    },
    [draft, resizeComposer, updateTypingActivity],
  );

  const resetComposer = useCallback(() => {
    setDraft("");
    setReplyingTo(null);
    setEditingMessage(null);
    setIsEmojiPickerOpen(false);
    clearSelectedAttachment();
    stopTyping();

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }, [clearSelectedAttachment, stopTyping]);

  const uploadSelectedAttachment = useCallback(
    async (file) => {
      setAttachmentUploadStatus("uploading");

      try {
        await prepareAttachment(file);
        if (selectedAttachmentRef.current === file) {
          setAttachmentUploadStatus("ready");
        }
      } catch (error) {
        if (
          selectedAttachmentRef.current === file &&
          error.name !== "AbortError"
        ) {
          setAttachmentUploadStatus("error");
        }
      }
    },
    [prepareAttachment],
  );

  const handleAttachmentChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      event.target.value = "";

      discardPreparedAttachment(selectedAttachmentRef.current);
      clearActionError();

      if (attachmentPreviewUrlRef.current) {
        URL.revokeObjectURL(attachmentPreviewUrlRef.current);
        attachmentPreviewUrlRef.current = "";
      }

      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "";

      attachmentPreviewUrlRef.current = previewUrl;
      selectedAttachmentRef.current = file;
      setAttachmentPreviewUrl(previewUrl);
      setSelectedAttachment(file);
      void uploadSelectedAttachment(file);
    },
    [clearActionError, discardPreparedAttachment, uploadSelectedAttachment],
  );

  const retrySelectedAttachment = useCallback(() => {
    if (selectedAttachmentRef.current) {
      void uploadSelectedAttachment(selectedAttachmentRef.current);
    }
  }, [uploadSelectedAttachment]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const content = draft.trim();
      if (
        (!content && !selectedAttachment) ||
        (selectedAttachment && attachmentUploadStatus !== "ready") ||
        !isConnected
      ) {
        return;
      }

      try {
        if (editingMessage) {
          await editMessage(editingMessage.id, content);
        } else {
          await sendMessage({
            content,
            replyToId: replyingTo?.id,
            file: selectedAttachment,
          });
        }

        resetComposer();
        inputRef.current?.focus();
      } catch {
        // The data hook exposes the server or timeout error in the chat banner.
      }
    },
    [
      attachmentUploadStatus,
      draft,
      editMessage,
      editingMessage,
      isConnected,
      replyingTo,
      resetComposer,
      selectedAttachment,
      sendMessage,
    ],
  );

  const handleReply = useCallback((message) => {
    setEditingMessage(null);
    setReplyingTo(message);
    inputRef.current?.focus();
  }, []);

  const handleEdit = useCallback(
    (message) => {
      stopTyping();
      clearSelectedAttachment();
      setReplyingTo(null);
      setEditingMessage(message);
      setDraft(message.content || "");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
        resizeComposer(inputRef.current);
      });
    },
    [clearSelectedAttachment, resizeComposer, stopTyping],
  );

  const handleComposerKeyDown = useCallback((event) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }, []);

  const handleDelete = useCallback(
    async (message) => {
      if (!window.confirm(t("chat-delete-confirmation"))) {
        return;
      }

      try {
        await deleteMessage(message.id);
        if (
          editingMessage?.id === message.id ||
          replyingTo?.id === message.id
        ) {
          resetComposer();
        }
      } catch {
        // The data hook exposes the server or timeout error in the chat banner.
      }
    },
    [deleteMessage, editingMessage, replyingTo, resetComposer, t],
  );

  const isSubmitting = isSending || Boolean(pendingActionId);
  const isAttachmentUploading =
    attachmentUploadStatus === "uploading" || isUploadingAttachment;
  const hasReadyAttachment =
    Boolean(selectedAttachment) && attachmentUploadStatus === "ready";
  const canSubmit =
    isConnected &&
    Boolean(draft.trim() || hasReadyAttachment) &&
    (!selectedAttachment || hasReadyAttachment) &&
    !isSubmitting &&
    !isAttachmentUploading;

  return {
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
    retrySelectedAttachment,
    handleSubmit,
    handleReply,
    handleEdit,
    handleComposerKeyDown,
    handleDelete,
  };
};
