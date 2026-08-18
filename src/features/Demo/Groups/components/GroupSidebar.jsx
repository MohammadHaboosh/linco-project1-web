import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoChevronBack,
  IoAddOutline,
  IoLockClosedOutline,
  IoChatbubblesOutline, // 💡 أيقونة جديدة للغروبات
  IoAlertCircleOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import styles from "./GroupWorkspace.module.css";

const GroupSidebar = ({
  demoId,
  isSidebarOpen,
  setIsSidebarOpen,
  groups,
  activeGroupId,
  isLoading,
  error,
  onRetry,
  onCreateClick,
  onGroupSelect,
}) => {
  const { t } = useTranslation();

  const handleGroupClick = (e, isLocked) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }

    onGroupSelect?.();
  };

  return (
    <aside
      className={`${styles.sidebar} ${
        isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
      }`}
      aria-label={t("group-workspaces", "Group workspaces")}
      aria-hidden={!isSidebarOpen}
      inert={!isSidebarOpen}
    >
      <div className={styles.sidebarHeader}>
        <h2>{t("workspaces", "Workspaces")}</h2>
        <button
          type="button"
          className={styles.toggleSidebarBtn}
          onClick={() => setIsSidebarOpen(false)}
          aria-label={t("close-workspaces", "Close workspaces")}
        >
          <IoChevronBack />
        </button>
      </div>

      <div className={styles.groupsList}>
        {isLoading ? (
          <div className={styles.sidebarStatus} role="status">
            <span className={styles.sidebarLoader} aria-hidden="true" />
            <span>{t("loading-groups", "Loading groups...")}</span>
          </div>
        ) : error ? (
          <div className={styles.sidebarStatus} role="alert">
            <IoAlertCircleOutline aria-hidden="true" />
            <span>{t("groups-load-failed", "Couldn't load groups")}</span>
            <button
              type="button"
              className={styles.sidebarRetryBtn}
              onClick={onRetry}
            >
              <IoRefreshOutline /> {t("try-again", "Try again")}
            </button>
          </div>
        ) : groups.length === 0 ? (
          <div className={styles.sidebarStatus}>
            <IoChatbubblesOutline aria-hidden="true" />
            <span>
              {t(
                "no-groups-yet",
                "No groups available. Create one to get started!",
              )}
            </span>
          </div>
        ) : (
          groups.map((group) => {
            const isLocked = group.isLocked;
            const groupName = group.name || group.title;
            const isActive = activeGroupId === group.id;

            return (
              <Link
                key={group.id}
                to={isLocked ? "#" : `/demos/${demoId}/groups/${group.id}`}
                className={`${styles.groupItem} ${
                  isActive ? styles.activeGroup : ""
                } ${isLocked ? styles.lockedGroup : ""}`}
                onClick={(e) => handleGroupClick(e, isLocked)}
                aria-current={isActive ? "page" : undefined}
                aria-disabled={isLocked || undefined}
                title={
                  isLocked
                    ? t("group-locked", "This group is locked")
                    : undefined
                }
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

                {isLocked && (
                  <IoLockClosedOutline className={styles.lockIcon} />
                )}
              </Link>
            );
          })
        )}
      </div>

      <div className={styles.sidebarFooter}>
        <button
          type="button"
          className={styles.createBtn}
          onClick={onCreateClick}
        >
          <IoAddOutline />
          <span>{t("new-group", "New Group")}</span>
        </button>
      </div>
    </aside>
  );
};

export default GroupSidebar;
