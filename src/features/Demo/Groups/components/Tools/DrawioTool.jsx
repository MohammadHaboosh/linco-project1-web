import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  createDrawioLoadAction,
  DRAWIO_EMBED_URL,
  isTrustedDrawioMessage,
  parseDrawioMessage,
  persistDrawioXml,
  postDrawioMessage,
  saveDrawioFileToDevice,
} from "../../../WorkspaceTools/utils/drawioProtocol";
import styles from "../GroupWorkspace.module.css";

const DrawioTool = forwardRef(({ storageKey, fileName }, ref) => {
  const iframeRef = useRef(null);
  const isReadyRef = useRef(false);
  const pendingShareRef = useRef(false);
  const isSavingFileRef = useRef(false);
  const [frameKey, setFrameKey] = useState(0);

  const requestPngExport = () =>
    postDrawioMessage(iframeRef.current, {
      action: "export",
      format: "png",
      spinKey: "export",
    });

  useImperativeHandle(ref, () => ({
    shareToChat: () => {
      if (isReadyRef.current) {
        requestPngExport();
      } else {
        pendingShareRef.current = true;
      }
    },
  }));

  useEffect(() => {
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
        const result = await saveDrawioFileToDevice(message.xml, fileName);
        reportSaveStatus(result.saved);

        if (result.error) {
          console.error("Unable to save the Draw.io file.", result.error);
        }
      } finally {
        isSavingFileRef.current = false;

        if (message.exit) {
          isReadyRef.current = false;
          setFrameKey((currentKey) => currentKey + 1);
        }
      }
    };

    const attachExportToChat = async (message) => {
      if (
        message.format !== "png" ||
        typeof message.data !== "string" ||
        !message.data.startsWith("data:image/png")
      ) {
        return;
      }

      try {
        const response = await fetch(message.data);
        if (!response.ok) throw new Error("Draw.io PNG export failed.");

        const blob = await response.blob();
        if (blob.type && blob.type !== "image/png") {
          throw new Error("Draw.io returned an invalid PNG export.");
        }

        const file = new File([blob], `diagram-${Date.now()}.png`, {
          type: "image/png",
        });

        window.dispatchEvent(
          new CustomEvent("attach-file-to-chat", { detail: { file } }),
        );
      } catch (error) {
        console.error("Unable to attach the Draw.io export to chat.", error);
      }
    };

    const handleMessage = (event) => {
      if (!isTrustedDrawioMessage(event, iframeRef.current)) return;

      const message = parseDrawioMessage(event.data);
      if (!message) return;

      if (message.event === "init") {
        isReadyRef.current = false;
        postDrawioMessage(
          iframeRef.current,
          createDrawioLoadAction(storageKey),
        );
        return;
      }

      if (message.event === "load") {
        isReadyRef.current = true;
        if (pendingShareRef.current) {
          pendingShareRef.current = false;
          requestPngExport();
        }
        return;
      }

      if (message.event === "autosave") {
        persistDrawioXml(storageKey, message.xml);

        if (message.exit) {
          isReadyRef.current = false;
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
        isReadyRef.current = false;
        setFrameKey((currentKey) => currentKey + 1);
        return;
      }

      if (message.event === "export") {
        void attachExportToChat(message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fileName, storageKey]);

  return (
    <iframe
      key={frameKey}
      ref={iframeRef}
      src={DRAWIO_EMBED_URL}
      className={styles.toolIframe}
      title="Draw.io Workspace"
    />
  );
});

DrawioTool.displayName = "DrawioTool";
export default DrawioTool;
