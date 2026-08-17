import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCloseOutline,
  IoOpenOutline,
  IoRefreshOutline,
  IoWarningOutline,
} from "react-icons/io5";
import {
  createDrawioLoadAction,
  isTrustedDrawioMessage,
  parseDrawioMessage,
  persistDrawioXml,
  postDrawioMessage,
  saveDrawioFileToDevice,
} from "../../utils/drawioProtocol";
import styles from "./ToolViewer.module.css";

const ToolViewer = ({ tool, onClose, storageKey }) => {
  const { t } = useTranslation();
  const iframeRef = useRef(null);
  const isSavingFileRef = useRef(false);
  const [frameStatus, setFrameStatus] = useState("loading");
  const [frameKey, setFrameKey] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (frameStatus !== "loading") return undefined;

    const loadTimeout = window.setTimeout(
      () => setFrameStatus("error"),
      20000,
    );
    return () => window.clearTimeout(loadTimeout);
  }, [frameKey, frameStatus]);

  useEffect(() => {
    if (tool.id !== "drawio") return undefined;

    const reportSaveStatus = (saved) => {
      postDrawioMessage(iframeRef.current, {
        action: "status",
        messageKey: saved ? "allChangesSaved" : "unsavedChanges",
        modified: !saved,
      });
    };

    const saveFileToDevice = async (message) => {
      if (isSavingFileRef.current) return;
      isSavingFileRef.current = true;

      try {
        const result = await saveDrawioFileToDevice(
          message.xml,
          `${tool.name || "diagram"}.drawio`,
        );
        reportSaveStatus(result.saved);

        if (result.error) {
          console.error("Unable to save the Draw.io file.", result.error);
        }
      } finally {
        isSavingFileRef.current = false;

        if (message.exit) {
          setFrameStatus("loading");
          setFrameKey((currentKey) => currentKey + 1);
        }
      }
    };

    const handleMessage = (event) => {
      if (!isTrustedDrawioMessage(event, iframeRef.current)) return;

      const message = parseDrawioMessage(event.data);
      if (!message) return;

      if (message.event === "init") {
        postDrawioMessage(
          iframeRef.current,
          createDrawioLoadAction(storageKey),
        );
        return;
      }

      if (message.event === "load") {
        setFrameStatus("loaded");
        return;
      }

      if (message.event === "autosave") {
        persistDrawioXml(storageKey, message.xml);

        if (message.exit) {
          setFrameStatus("loading");
          setFrameKey((currentKey) => currentKey + 1);
        }
        return;
      }

      if (message.event === "save") {
        persistDrawioXml(storageKey, message.xml);
        void saveFileToDevice(message);
        return;
      }

      if (message.event === "exit") {
        setFrameStatus("loading");
        setFrameKey((currentKey) => currentKey + 1);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [storageKey, tool.id, tool.name]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
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
              autoFocus
              title={t("close-named-tool", { name: tool.name })}
              aria-label={t("close-named-tool", { name: tool.name })}
            >
              <IoCloseOutline aria-hidden="true" />
            </button>
          </div>
        </div>

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
            onLoad={() => {
              if (tool.id !== "drawio") setFrameStatus("loaded");
            }}
            onError={() => setFrameStatus("error")}
          />
        </div>
      </div>
    </div>
  );
};

export default ToolViewer;
