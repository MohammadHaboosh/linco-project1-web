import { useNavigate, useParams } from "react-router-dom";
import { IoSearchOutline, IoChatbubblesOutline } from "react-icons/io5";
import styles from "./Chats.module.css";
import { useTranslation } from "react-i18next";

const ChatSidebar = ({ groups, activeChatId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId } = useParams();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.headerTitle}>
          <IoChatbubblesOutline className={styles.headerIcon} />
          <h2>{t("groups")}</h2>
        </div>
        <div className={styles.searchBox}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t("search-groups")}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.groupList}>
        {groups.map((group) => (
          <div
            key={group.id}
            className={`${styles.groupItem} ${activeChatId === group.id ? styles.activeGroup : ""}`}
            onClick={() => navigate(`/demos/${demoId}/chats/${group.id}`)}
          >
            <div className={styles.groupAvatar}>{group.name.charAt(0)}</div>
            <div className={styles.groupInfo}>
              <div className={styles.groupTopRow}>
                <span className={styles.groupName}>{group.name}</span>
                <span className={styles.groupTime}>{group.time}</span>
              </div>
              <div className={styles.groupBottomRow}>
                <span className={styles.lastMessage}>{group.lastMsg}</span>
                {group.unread > 0 && (
                  <span className={styles.unreadBadge}>{group.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
