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
  isMobile,
}) => {
  const { t } = useTranslation();
  const groupName = activeGroup.name || activeGroup.title || "";
  const groupInitials =
    activeGroup.initials || groupName.substring(0, 2).toUpperCase();

  return (
    <header className={styles.workspaceToolbar}>
      <div className={styles.toolbarLeft}>
        {!isSidebarOpen && (
          <button
            type="button"
            className={styles.openSidebarBtn}
            onClick={() => setIsSidebarOpen(true)}
            aria-label={t("open-workspaces", "Open demos")}
          >
            <IoMenu />
          </button>
        )}
        <div className={styles.activeGroupInfo}>
          <div className={styles.activeGroupAvatar} aria-hidden="true">
            {groupInitials}
          </div>
          <h3 title={groupName}>{groupName}</h3>
        </div>
      </div>

      <div className={styles.toolbarCenter}>
        <div
          className={styles.toolSelectors}
          role="group"
          aria-label={t("workspace-tools", "Demo tools")}
        >
          <button
            type="button"
            className={`${styles.toolBtn} ${activeTool === "photopea" ? styles.activeToolBtn : ""}`}
            onClick={() => onToolSelect("photopea")}
            aria-pressed={activeTool === "photopea"}
            aria-label={t("open-photopea", "Open Photopea")}
          >
            <IoBrushOutline />
            <span className={styles.toolLabel}>{t("photopea", "Photopea")}</span>
          </button>
          <button
            type="button"
            className={`${styles.toolBtn} ${activeTool === "drawio" ? styles.activeToolBtn : ""}`}
            onClick={() => onToolSelect("drawio")}
            aria-pressed={activeTool === "drawio"}
            aria-label={t("open-drawio", "Open Draw.io")}
          >
            <IoShareSocialOutline />
            <span className={styles.toolLabel}>{t("drawio", "Draw.io")}</span>
          </button>

          {activeTool && (
            <>
              <div className={styles.toolbarDivider} aria-hidden="true" />
              <button
                type="button"
                className={styles.shareActionBtn}
                onClick={onShareToChat}
                aria-label={t("share-work", "Share to Chat")}
              >
                <IoSendOutline />
                <span className={styles.shareLabel}>
                  {t("share-work", "Share to Chat")}
                </span>
                <span className={styles.mobileShareLabel}>
                  {t("share", "Share")}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.toolbarRight}>
        <div
          className={styles.layoutSegmentedControl}
          role="group"
          aria-label={t("workspace-view", "Demo view")}
        >
          <button
            type="button"
            className={`${styles.layoutBtn} ${layout === "members" ? styles.activeLayoutBtn : ""}`}
            onClick={() => onLayoutChange("members")}
            title={t("members", "Members")}
            aria-label={t("members", "Members")}
            aria-pressed={layout === "members"}
          >
            <IoPeopleOutline />
          </button>
          <button
            type="button"
            className={`${styles.layoutBtn} ${layout === "chat-only" ? styles.activeLayoutBtn : ""}`}
            onClick={() => onLayoutChange("chat-only")}
            title={t("chat-only", "Chat Only")}
            aria-label={t("chat-only", "Chat Only")}
            aria-pressed={layout === "chat-only"}
          >
            <IoChatbubblesOutline />
          </button>
          {!isMobile && (
            <button
              type="button"
              className={`${styles.layoutBtn} ${layout === "split" ? styles.activeLayoutBtn : ""}`}
              onClick={() => onLayoutChange("split")}
              title={t("split-view", "Split View")}
              aria-label={t("split-view", "Split View")}
              aria-pressed={layout === "split"}
            >
              <IoAlbumsOutline />
            </button>
          )}
          <button
            type="button"
            className={`${styles.layoutBtn} ${layout === "tool-only" ? styles.activeLayoutBtn : ""}`}
            onClick={() => onLayoutChange("tool-only")}
            title={t("tool-only", "Tool Only")}
            aria-label={t("tool-only", "Tool Only")}
            aria-pressed={layout === "tool-only"}
          >
            <IoSquareOutline />
          </button>
        </div>
      </div>
    </header>
  );
};

export default WorkspaceToolbar;
