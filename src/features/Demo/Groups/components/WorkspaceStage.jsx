import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoBrushOutline } from "react-icons/io5";
import ChatLayout from "../../Chats/components/ChatLayout";
import { createDrawioStorageKey } from "../../WorkspaceTools/utils/drawioProtocol";
import DrawioTool from "./Tools/DrawioTool";
import PhotopeaTool from "./Tools/PhotopeaTool";
import styles from "./GroupWorkspace.module.css";

const WorkspaceStage = ({
  layout,
  activeTool,
  triggerShareTool,
  workspaceKey,
  hasOpenedDrawio,
}) => {
  const { t } = useTranslation();

  const photopeaRef = useRef(null);
  const drawioRef = useRef(null);
  const lastHandledShareTriggerRef = useRef(triggerShareTool);

  useEffect(() => {
    if (
      !triggerShareTool ||
      triggerShareTool === lastHandledShareTriggerRef.current
    ) {
      return;
    }

    lastHandledShareTriggerRef.current = triggerShareTool;
    if (activeTool === "photopea") photopeaRef.current?.shareToChat();
    if (activeTool === "drawio") drawioRef.current?.shareToChat();
  }, [triggerShareTool, activeTool]);

  const drawioStorageKey = createDrawioStorageKey(
    `group-workspace:${workspaceKey}`,
  );

  return (
    <div className={styles.workspaceStage}>
      <div
        className={`${styles.panel} ${
          layout === "chat-only"
            ? styles.panelFull
            : layout === "split"
              ? styles.chatPanelSplit
              : styles.panelHidden
        }`}
      >
        <ChatLayout showHeader={false} />
      </div>

      <div
        className={`${styles.panel} ${
          layout === "tool-only"
            ? styles.panelFull
            : layout === "split"
              ? styles.toolPanelSplit
              : styles.panelHidden
        }`}
      >
        {activeTool === "photopea" && (
          <PhotopeaTool key={workspaceKey} ref={photopeaRef} />
        )}
        {(activeTool === "drawio" || hasOpenedDrawio) && (
          <div
            className={styles.toolInstance}
            hidden={activeTool !== "drawio"}
          >
            <DrawioTool
              key={workspaceKey}
              ref={drawioRef}
              storageKey={drawioStorageKey}
            />
          </div>
        )}
        {!activeTool && (
          <div className={styles.noToolSelected}>
            <IoBrushOutline className={styles.noToolIcon} />
            <p>
              {t(
                "select-tool-to-start",
                "Select a tool from the toolbar to start collaborating",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceStage;
