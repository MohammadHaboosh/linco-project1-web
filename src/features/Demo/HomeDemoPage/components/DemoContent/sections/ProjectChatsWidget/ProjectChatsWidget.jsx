import { useTranslation } from "react-i18next";
import styles from "./ProjectChatsWidget.module.css";

const ProjectChatsWidget = ({ chats }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.chatsCard}>
      <h3 className={styles.chatsTitle}>{t("project-discussions")}</h3>
      <p className={styles.chatsSubtitle}>
        {t("recent-activity-in-your-groups")}
      </p>
      <div className={styles.chatsList}>
        {chats.map((chat) => (
          <div key={chat.id} className={styles.chatItem}>
            <div
              className={styles.chatAvatar}
              style={{ backgroundColor: chat.avatarColor }}
            >
              {chat.projectName.substring(0, 2).toUpperCase()}
            </div>
            <div className={styles.chatInfo}>
              <div className={styles.chatHeader}>
                <h4>{chat.projectName}</h4>
                <span className={styles.chatTime}>{chat.time}</span>
              </div>
              <div className={styles.chatMessageRow}>
                <p className={styles.chatMessage}>{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className={styles.unreadBadge}>{chat.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {t("view-all-channels")}
      <button className={styles.viewAllChatsBtn}>
        {t("view-all-channels")}
      </button>
    </div>
  );
};

export default ProjectChatsWidget;
