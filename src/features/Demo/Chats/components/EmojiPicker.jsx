import { useEffect, useRef } from "react";
import { IoHappyOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./Chats.module.css";

const EmojiPicker = ({
  isOpen,
  disabled,
  inputRef,
  onSelect,
  onToggle,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const selectionHandlerRef = useRef(onSelect);

  useEffect(() => {
    selectionHandlerRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        onClose();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !mountRef.current) {
      return undefined;
    }

    const pickerMount = mountRef.current;
    const isArabic = String(i18n.resolvedLanguage || i18n.language)
      .toLowerCase()
      .startsWith("ar");
    let isCancelled = false;

    const mountEmojiPicker = async () => {
      const [{ default: emojiData }, { Picker }, arabicTranslations] =
        await Promise.all([
          import("@emoji-mart/data"),
          import("emoji-mart"),
          isArabic
            ? import("@emoji-mart/data/i18n/ar.json")
            : Promise.resolve(null),
        ]);

      if (isCancelled) {
        return;
      }

      const picker = new Picker({
        data: emojiData,
        dynamicWidth: true,
        i18n: arabicTranslations?.default,
        locale: isArabic ? "ar" : "en",
        onEmojiSelect: (emoji) =>
          selectionHandlerRef.current?.(emoji.native),
        previewPosition: "none",
        set: "native",
        theme: "light",
      });

      pickerMount.replaceChildren(picker);
    };

    void mountEmojiPicker();

    return () => {
      isCancelled = true;
      pickerMount.replaceChildren();
    };
  }, [i18n.language, i18n.resolvedLanguage, isOpen]);

  return (
    <div className={styles.emojiPickerContainer} ref={containerRef}>
      <button
        type="button"
        className={`${styles.actionIcon} ${
          isOpen ? styles.emojiActionActive : ""
        }`}
        onClick={onToggle}
        disabled={disabled}
        title={t("chat-select-emoji")}
        aria-label={t("chat-select-emoji")}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <IoHappyOutline />
      </button>

      {isOpen && (
        <div
          className={styles.emojiPicker}
          role="dialog"
          aria-label={t("chat-emoji-picker")}
        >
          <div className={styles.emojiPickerMount} ref={mountRef} />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
