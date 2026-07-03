import { useState, useRef } from "react";
import {
  IoCloseOutline,
  IoOpenOutline,
  IoCloudUploadOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import styles from "./ToolViewer.module.css";

const ToolViewer = ({ tool, onClose }) => {
  const iframeRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveToLinCo = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 💡 هنا يتم التخاطب مع الأداة:
      // if (tool.id === 'drawio') {
      //   iframeRef.current.contentWindow.postMessage(JSON.stringify({ action: 'export', format: 'xmlsvg' }), '*');
      // } else if (tool.id === 'photopea') {
      //   iframeRef.current.contentWindow.postMessage('app.activeDocument.saveToOE("png");', '*');
      // }

      // محاكاة لانتظار رد الأداة ورفع الملف للباك-إند
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // إخفاء رسالة النجاح بعد 3 ثواني
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.viewerOverlay}>
      <div className={styles.viewerContainer}>
        <div className={styles.viewerHeader}>
          <div className={styles.toolInfo}>
            <img
              src={tool.icon}
              alt={tool.name}
              className={styles.headerIcon}
            />
            <h2 className={styles.headerTitle}>{tool.name} Workspace</h2>
          </div>

          <div className={styles.headerActions}>
            {/* زر الحفظ الجديد */}
            <button
              className={`${styles.saveBtn} ${saveSuccess ? styles.saveSuccess : ""}`}
              onClick={handleSaveToLinCo}
              disabled={isSaving || saveSuccess}
            >
              {isSaving ? (
                <span className={styles.loader}></span>
              ) : saveSuccess ? (
                <>
                  <IoCheckmarkCircleOutline className={styles.btnIcon} /> Saved!
                </>
              ) : (
                <>
                  <IoCloudUploadOutline className={styles.btnIcon} /> Save to
                  LinCo
                </>
              )}
            </button>

            <div className={styles.divider}></div>

            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className={styles.externalLinkBtn}
              title="Open in new tab"
            >
              <IoOpenOutline />
            </a>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              title="Close Tool"
            >
              <IoCloseOutline />
            </button>
          </div>
        </div>

        <div className={styles.iframeWrapper}>
          <iframe
            ref={iframeRef}
            src={tool.url}
            className={styles.iframe}
            title={`${tool.name} Embed`}
            allow="fullscreen; clipboard-read; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ToolViewer;
