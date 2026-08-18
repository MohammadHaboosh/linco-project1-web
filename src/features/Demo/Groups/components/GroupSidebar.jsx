import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoChevronBack,
  IoAddOutline,
  IoLockClosedOutline,
  IoChatbubblesOutline, // 💡 أيقونة جديدة للغروبات
} from "react-icons/io5";
import styles from "./GroupWorkspace.module.css";

const GroupSidebar = ({
  demoId,
  isSidebarOpen,
  setIsSidebarOpen,
  groups,
  activeGroupId,
  onCreateClick,
}) => {
  const { t } = useTranslation();

  const handleGroupClick = (e, isLocked) => {
    if (isLocked) {
      e.preventDefault();
    }
  };

  return (
    <aside
      className={`${styles.sidebar} ${
        isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
      }`}
    >
      <div className={styles.sidebarHeader}>
        <h2>{t("workspaces", "Workspaces")}</h2>
        <button
          className={styles.toggleSidebarBtn}
          onClick={() => setIsSidebarOpen(false)}
        >
          <IoChevronBack />
        </button>
      </div>

      <div className={styles.groupsList}>
        {groups.map((group) => {
          const isLocked = group.isLocked;
          const groupName = group.name || group.title;

          return (
            <Link
              key={group.id}
              to={isLocked ? "#" : `/demos/${demoId}/groups/${group.id}`}
              className={`
                ${styles.groupItem} 
                ${activeGroupId === group.id ? styles.activeGroup : ""} 
                ${isLocked ? styles.lockedGroup : ""}
              `}
              onClick={(e) => handleGroupClick(e, isLocked)}
            >
              <div className={styles.groupIconWrapper}>
                <IoChatbubblesOutline />
              </div>

              <div className={styles.groupTextData}>
                <span className={styles.groupName}>{groupName}</span>
                {group.description && (
                  <span className={styles.groupSidebarDesc}>
                    {group.description}
                  </span>
                )}
              </div>

              {isLocked && <IoLockClosedOutline className={styles.lockIcon} />}
            </Link>
          );
        })}
      </div>

      <div className={styles.sidebarFooter}>
        <button className={styles.createBtn} onClick={onCreateClick}>
          <IoAddOutline />
          <span>{t("new-group", "New Group")}</span>
        </button>
      </div>
    </aside>
  );
};

export default GroupSidebar;
