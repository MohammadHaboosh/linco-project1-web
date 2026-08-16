import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoCloudUploadOutline,
  IoOpenOutline,
  IoRefreshOutline,
  IoWarningOutline,
} from "react-icons/io5";
import styles from "./ToolViewer.module.css";

const ToolViewer = ({ tool, onClose }) => {
  const { t } = useTranslation();
  const iframeRef = useRef(null);
  const successTimerRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [frameStatus, setFrameStatus] = useState("loading");
  const [frameKey, setFrameKey] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(successTimerRef.current);
    };
  }, [isSaving, onClose]);

  useEffect(() => {
    if (frameStatus !== "loading") return undefined;

    const loadTimeout = window.setTimeout(
      () => setFrameStatus("error"),
      20000,
    );
    return () => window.clearTimeout(loadTimeout);
  }, [frameKey, frameStatus]);

  const handleSaveToLinCo = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(false);

    try {
      // The embedded tool integration will request and upload an export here.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSaveSuccess(true);
      successTimerRef.current = window.setTimeout(
        () => setSaveSuccess(false),
        3000,
      );
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSaving) onClose();
  };

  const retryFrame = () => {
    setFrameStatus("loading");
    setFrameKey((currentKey) => currentKey + 1);
  };

  return (
    <div
      className={styles.viewerOverlay}
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={styles.viewerContainer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-tool-viewer-title"
      >
        <div className={styles.viewerHeader}>
          <div className={styles.toolInfo}>
            <img
              src={tool.icon}
              alt=""
              className={styles.headerIcon}
            />
            <h2 id="workspace-tool-viewer-title" className={styles.headerTitle}>
              {t("named-tool-workspace", { name: tool.name })}
            </h2>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={`${styles.saveBtn} ${saveSuccess ? styles.saveSuccess : ""}`}
              onClick={handleSaveToLinCo}
              disabled={isSaving || saveSuccess}
            >
              {isSaving ? (
                <>
                  <span className={styles.loader} aria-hidden="true" />
                  {t("saving-tool-to-linco", { name: tool.name })}
                </>
              ) : saveSuccess ? (
                <>
                  <IoCheckmarkCircleOutline
                    className={styles.btnIcon}
                    aria-hidden="true"
                  />
                  {t("tool-saved-to-linco", { name: tool.name })}
                </>
              ) : (
                <>
                  <IoCloudUploadOutline
                    className={styles.btnIcon}
                    aria-hidden="true"
                  />
                  {t("save-tool-to-linco")}
                </>
              )}
            </button>

            <span className={styles.divider} aria-hidden="true" />

            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className={styles.externalLinkBtn}
              title={t("open-named-tool-new-tab", { name: tool.name })}
              aria-label={t("open-named-tool-new-tab", { name: tool.name })}
            >
              <IoOpenOutline aria-hidden="true" />
            </a>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              disabled={isSaving}
              autoFocus
              title={t("close-named-tool", { name: tool.name })}
              aria-label={t("close-named-tool", { name: tool.name })}
            >
              <IoCloseOutline aria-hidden="true" />
            </button>
          </div>
        </div>

        {saveError && (
          <div className={styles.saveError} role="alert">
            {t("tool-save-failed", { name: tool.name })}
          </div>
        )}

        <div
          className={styles.iframeWrapper}
          aria-busy={frameStatus === "loading"}
        >
          {frameStatus === "loading" && (
            <div className={styles.frameState} role="status" aria-live="polite">
              <span className={styles.frameLoader} aria-hidden="true" />
              <strong>{t("loading-named-tool", { name: tool.name })}</strong>
              <p>{t("loading-workspace-tool-description")}</p>
            </div>
          )}

          {frameStatus === "error" && (
            <div className={styles.frameState} role="alert">
              <IoWarningOutline aria-hidden="true" />
              <strong>{t("workspace-tool-load-failed")}</strong>
              <p>{t("workspace-tool-load-error-message", { name: tool.name })}</p>
              <button type="button" onClick={retryFrame}>
                <IoRefreshOutline aria-hidden="true" />
                {t("try-again")}
              </button>
            </div>
          )}

          <iframe
            key={frameKey}
            ref={iframeRef}
            src={tool.url}
            className={styles.iframe}
            title={t("embedded-tool-title", { name: tool.name })}
            allow="fullscreen; clipboard-read; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setFrameStatus("loaded")}
            onError={() => setFrameStatus("error")}
          />
        </div>
      </div>
    </div>
  );
};

export default ToolViewer;
