import { useTranslation } from "react-i18next";
import { IoMenu, IoPeopleOutline } from "react-icons/io5";
import styles from "./GroupWorkspace.module.css";

const EmptyWorkspace = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.emptyWorkspace}>
      {!isSidebarOpen && (
        <button
          className={styles.absoluteOpenBtn}
          onClick={() => setIsSidebarOpen(true)}
        >
          <IoMenu />
        </button>
      )}
      <div className={styles.emptyStateContent}>
        <div className={styles.emptyStateIcon}>
          <IoPeopleOutline />
        </div>
        <h2>{t("welcome-to-workspaces", "Collaborative Workspaces")}</h2>
        <p>
          {t(
            "select-workspace-desc",
            "Select a group from the sidebar to start chatting, drawing, and brainstorming with your team.",
          )}
        </p>
      </div>
    </div>
  );
};

export default EmptyWorkspace;
