import { useState } from "react";
import {
  IoAddOutline,
  IoChatbubblesOutline,
  IoExtensionPuzzleOutline,
  IoCloseOutline,
  IoSettingsOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import styles from "./GroupWorkspace.module.css";
import CreateGroupModal from "./CreateGroupModal";

const AVAILABLE_TOOLS = [
  {
    id: "drawio",
    name: "Draw.io",
    url: "https://embed.diagrams.net/?embed=1&ui=min",
    icon: "https://cdn.jsdelivr.net/gh/jgraph/drawio/src/main/webapp/images/logo.png",
  },
  {
    id: "photopea",
    name: "Photopea",
    url: "https://www.photopea.com/",
    icon: "https://www.photopea.com/promo/icon512.png",
  },
];

const MOCK_GROUPS = [
  { id: "1", name: "Backend Architecture", members: 12, isActive: true },
  { id: "2", name: "UI/UX Designers", members: 5, isActive: false },
  { id: "3", name: "Project Management", members: 8, isActive: false },
];

const GroupWorkspace = () => {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [activeGroup, setActiveGroup] = useState(MOCK_GROUPS[0]);
  const [activeTool, setActiveTool] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  return (
    <div className={styles.workspaceContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Chat Groups</h2>
          <button
            className={styles.createGroupBtn}
            onClick={() => setShowCreateModal(true)}
          >
            <IoAddOutline />
          </button>
        </div>

        <div className={styles.groupsList}>
          {groups.map((group) => (
            <div
              key={group.id}
              className={`${styles.groupItem} ${activeGroup.id === group.id ? styles.activeGroup : ""}`}
              onClick={() => setActiveGroup(group)}
            >
              <div className={styles.groupAvatar}>{group.name.charAt(0)}</div>
              <div className={styles.groupInfo}>
                <span className={styles.groupName}>{group.name}</span>
                <span className={styles.groupMembers}>
                  {group.members} members
                </span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerAvatar}>
              {activeGroup.name.charAt(0)}
            </div>
            <div>
              <h3 className={styles.headerTitle}>{activeGroup.name}</h3>
              <span className={styles.headerSubtitle}>
                <IoPeopleOutline /> {activeGroup.members} Members
              </span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.toolsMenuContainer}>
              <button
                className={`${styles.launchToolBtn} ${activeTool ? styles.toolActiveBtn : ""}`}
                onClick={() => setShowToolsMenu(!showToolsMenu)}
              >
                <IoExtensionPuzzleOutline />{" "}
                {activeTool ? "Change Tool" : "Launch Tool"}
              </button>

              {showToolsMenu && (
                <div className={styles.toolsDropdown}>
                  <p className={styles.dropdownTitle}>Collaborative Tools</p>
                  {AVAILABLE_TOOLS.map((tool) => (
                    <div
                      key={tool.id}
                      className={styles.toolOption}
                      onClick={() => {
                        setActiveTool(tool);
                        setShowToolsMenu(false);
                      }}
                    >
                      <img src={tool.icon} alt={tool.name} />
                      <span>{tool.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className={styles.iconBtn}>
              <IoSettingsOutline />
            </button>
          </div>
        </header>

        <div className={styles.splitScreenContainer}>
          {activeTool && (
            <div className={styles.toolWorkspace}>
              <div className={styles.toolHeader}>
                <div className={styles.toolInfo}>
                  <img src={activeTool.icon} alt={activeTool.name} />
                  <span>{activeTool.name} Session</span>
                </div>
                <button
                  className={styles.closeToolBtn}
                  onClick={() => setActiveTool(null)}
                >
                  <IoCloseOutline /> Close
                </button>
              </div>
              <iframe
                src={activeTool.url}
                className={styles.toolIframe}
                title="Workspace Tool"
              ></iframe>
            </div>
          )}

          <div
            className={`${styles.chatArea} ${activeTool ? styles.chatAreaCompact : styles.chatAreaFull}`}
          >
            <div className={styles.mockChatArea}>
              <div className={styles.mockMessages}>
                <div className={styles.mockMessageThem}>
                  <div className={styles.mockAvatar}>A</div>
                  <div className={styles.mockBubbleThem}>
                    Welcome to the {activeGroup.name} group! Let's collaborate.
                  </div>
                </div>
                {activeTool && (
                  <div className={styles.mockMessageSystem}>
                    A collaborative tool ({activeTool.name}) was launched.
                  </div>
                )}
                <div className={styles.mockMessageMe}>
                  <div className={styles.mockBubbleMe}>
                    Sounds great! I am ready.
                  </div>
                </div>
              </div>
              <div className={styles.mockComposer}>
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default GroupWorkspace;
