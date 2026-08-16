import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import styles from "../GroupWorkspace.module.css";

const DrawioTool = forwardRef((props, ref) => {
  const iframeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    shareToChat: () => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            action: "export",
            format: "png",
            spin: "Updating...",
          }),
          "*",
        );
      }
    },
  }));

  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data || typeof e.data !== "string") return;
      try {
        const msg = JSON.parse(e.data);
        if (msg.event === "export" && msg.data) {
          const fetchRes = fetch(msg.data);
          fetchRes
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], `diagram-${Date.now()}.png`, {
                type: "image/png",
              });

              window.dispatchEvent(
                new CustomEvent("attach-file-to-chat", { detail: { file } }),
              );
            });
        }
      } catch (err) {
        console.log("Error parsing message from Draw.io iframe:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://app.diagrams.net/?embed=1&ui=min&spin=1&proto=json&configure=1"
      className={styles.toolIframe}
      title="Draw.io Workspace"
    />
  );
});

DrawioTool.displayName = "DrawioTool";
export default DrawioTool;
