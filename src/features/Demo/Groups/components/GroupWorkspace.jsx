import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoAddOutline,
  IoChatbubblesOutline,
  IoBrushOutline,
  IoGitNetworkOutline,
  IoSquareHalfOutline,
  IoStopOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import ChatLayout from "../../Chats/components/ChatLayout";
import styles from "./GroupWorkspace.module.css";
import { PATHS } from "../../../../routes/paths";

const MOCK_GROUPS = [
  { id: "g1", name: "React Developers", initials: "RD" },
  { id: "g2", name: "UI/UX Masters", initials: "UI" },
  { id: "g3", name: "Backend Architecture", initials: "BA" },
];

const GroupWorkspace = () => {
  const { t } = useTranslation();
  const { groupId } = useParams();

  const [layout, setLayout] = useState("chat-only");
  const [activeTool, setActiveTool] = useState(null);

  const activeGroup =
    MOCK_GROUPS.find((g) => g.id === groupId) || MOCK_GROUPS[0];

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (layout === "chat-only") {
      setLayout("split");
    }
  };

  const handleLayoutChange = (newLayout) => {
    if ((newLayout === "split" || newLayout === "tool-only") && !activeTool) {
      setActiveTool("photopea");
    }
    setLayout(newLayout);
  };

  return (
    <div className={styles.appContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to={PATHS.HOME} className={styles.backLink}>
            <IoArrowBackOutline />
          </Link>
          <h2>{t("workspaces", "Workspaces")}</h2>
        </div>

        <div className={styles.groupsList}>
          {MOCK_GROUPS.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className={`${styles.groupItem} ${activeGroup.id === group.id ? styles.activeGroup : ""}`}
            >
              <div className={styles.groupAvatar}>{group.initials}</div>
              <span className={styles.groupName}>{group.name}</span>
            </Link>
          ))}
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.createBtn}>
            <IoAddOutline />
            <span>{t("new-group", "New Group")}</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainWorkspace}>
        <header className={styles.workspaceToolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.activeGroupInfo}>
              <div className={styles.activeGroupAvatar}>
                {activeGroup.initials}
              </div>
              <h3>{activeGroup.name}</h3>
            </div>
          </div>

          <div className={styles.toolbarCenter}>
            <div className={styles.toolSelectors}>
              <button
                className={`${styles.toolBtn} ${activeTool === "photopea" ? styles.activeToolBtn : ""}`}
                onClick={() => handleToolSelect("photopea")}
              >
                <IoBrushOutline /> Photopea
              </button>
              <button
                className={`${styles.toolBtn} ${activeTool === "drawio" ? styles.activeToolBtn : ""}`}
                onClick={() => handleToolSelect("drawio")}
              >
                <IoGitNetworkOutline /> Draw.io
              </button>
            </div>
          </div>

          <div className={styles.toolbarRight}>
            <div className={styles.layoutSegmentedControl}>
              <button
                className={`${styles.layoutBtn} ${layout === "chat-only" ? styles.activeLayoutBtn : ""}`}
                onClick={() => handleLayoutChange("chat-only")}
                title={t("chat-only", "Chat Only")}
              >
                <IoChatbubblesOutline />
              </button>
              <button
                className={`${styles.layoutBtn} ${layout === "split" ? styles.activeLayoutBtn : ""}`}
                onClick={() => handleLayoutChange("split")}
                title={t("split-view", "Split View")}
              >
                <IoSquareHalfOutline />
              </button>
              <button
                className={`${styles.layoutBtn} ${layout === "tool-only" ? styles.activeLayoutBtn : ""}`}
                onClick={() => handleLayoutChange("tool-only")}
                title={t("tool-only", "Tool Only")}
              >
                <IoStopOutline />
              </button>
            </div>
          </div>
        </header>

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
            <ChatLayout />
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
      </main>
    </div>
  );
};

export default GroupWorkspace;
