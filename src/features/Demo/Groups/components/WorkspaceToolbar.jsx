import { useTranslation } from "react-i18next";
import {
  IoMenu,
  IoBrushOutline,
  IoShareSocialOutline,
  IoChatbubblesOutline,
  IoAlbumsOutline,
  IoSquareOutline,
  IoSendOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import styles from "./GroupWorkspace.module.css";

const WorkspaceToolbar = ({
  activeGroup,
  isSidebarOpen,
  setIsSidebarOpen,
  activeTool,
  onToolSelect,
  layout,
  onLayoutChange,
  onShareToChat,
}) => {
  const { t } = useTranslation();

  return (
    <header className={styles.workspaceToolbar}>
      <div className={styles.toolbarLeft}>
        {!isSidebarOpen && (
          <button
            className={styles.openSidebarBtn}
            onClick={() => setIsSidebarOpen(true)}
          >
            <IoMenu />
          </button>
        )}
        <div className={styles.activeGroupInfo}>
          <div className={styles.activeGroupAvatar}>{activeGroup.initials}</div>
          <h3>{activeGroup.name}</h3>
        </div>
      </div>

      <div className={styles.toolbarCenter}>
        <div className={styles.toolSelectors}>
          <button
            className={`${styles.toolBtn} ${activeTool === "photopea" ? styles.activeToolBtn : ""}`}
            onClick={() => onToolSelect("photopea")}
          >
            <IoBrushOutline /> Photopea
          </button>
          <button
            className={`${styles.toolBtn} ${activeTool === "drawio" ? styles.activeToolBtn : ""}`}
            onClick={() => onToolSelect("drawio")}
          >
            <IoShareSocialOutline /> Draw.io
          </button>

          {activeTool && (
            <>
              <div className={styles.toolbarDivider}></div>
              <button className={styles.shareActionBtn} onClick={onShareToChat}>
                <IoSendOutline /> {t("share-work", "Share to Chat")}
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.toolbarRight}>
        <div className={styles.layoutSegmentedControl}>
          <button
            className={`${styles.layoutBtn} ${layout === "members" ? styles.activeLayoutBtn : ""}`}
            onClick={() => onLayoutChange("members")}
            title={t("members", "Members")}
          >
            <IoPeopleOutline />
          </button>
          <button
            className={`${styles.layoutBtn} ${layout === "chat-only" ? styles.activeLayoutBtn : ""}`}
            onClick={() => onLayoutChange("chat-only")}
            title={t("chat-only", "Chat Only")}
          >
            <IoChatbubblesOutline />
          </button>
          <button
            className={`${styles.layoutBtn} ${layout === "split" ? styles.activeLayoutBtn : ""}`}
            onClick={() => onLayoutChange("split")}
            title={t("split-view", "Split View")}
          >
            <IoAlbumsOutline />
          </button>
          <button
            className={`${styles.layoutBtn} ${layout === "tool-only" ? styles.activeLayoutBtn : ""}`}
            onClick={() => onLayoutChange("tool-only")}
            title={t("tool-only", "Tool Only")}
          >
            <IoSquareOutline />
          </button>
        </div>
      </div>
    </header>
  );
};

export default WorkspaceToolbar;
