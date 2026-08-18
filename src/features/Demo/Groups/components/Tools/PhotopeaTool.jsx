import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import styles from "../GroupWorkspace.module.css";

const PhotopeaTool = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const iframeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    shareToChat: () => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(
          'app.activeDocument.saveToOE("png");',
          "*",
        );
      }
    },
  }));

  useEffect(() => {
    const handleMessage = (e) => {
      if (
        typeof e.data === "object" &&
        e.data.constructor.name === "ArrayBuffer"
      ) {
        const blob = new Blob([e.data], { type: "image/png" });
        const file = new File([blob], `design-${Date.now()}.png`, {
          type: "image/png",
        });

        window.dispatchEvent(
          new CustomEvent("attach-file-to-chat", { detail: { file } }),
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://www.photopea.com/"
      className={styles.toolIframe}
      title={t("named-tool-workspace", {
        name: t("photopea", "Photopea"),
      })}
    />
  );
});

PhotopeaTool.displayName = "PhotopeaTool";
export default PhotopeaTool;
