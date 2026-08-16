import { useTranslation } from "react-i18next";
import { IoBrushOutline } from "react-icons/io5";
import ChatLayout from "../../Chats/components/ChatLayout";
import styles from "./GroupWorkspace.module.css";

const WorkspaceStage = ({ layout, activeTool }) => {
  const { t } = useTranslation();

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
          <iframe
            src="https://www.photopea.com/"
            className={styles.toolIframe}
            title="Photopea Workspace"
          />
        )}
        {activeTool === "drawio" && (
          <iframe
            src="https://app.diagrams.net/?embed=1&ui=min&spin=1&proto=json"
            className={styles.toolIframe}
            title="Draw.io Workspace"
          />
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
