import { useNavigate, useParams } from "react-router-dom";
import {
  IoChatbubblesOutline,
  IoPeopleOutline,
  IoChevronForward,
  IoChevronForwardOutline,
} from "react-icons/io5";
import styles from "./Chats.module.css";
import { PATHS } from "../../../../routes/paths";

const MOCK_GROUPS = [
  {
    id: "g1",
    name: "Front-End Developers",
    members: 12,
    lastMsg: "Omar: Check the new design components",
    time: "10:30 AM",
    unread: 3,
  },
  {
    id: "g2",
    name: "UI/UX Designers",
    members: 5,
    lastMsg: "Sara: The prototype is ready for review",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "g3",
    name: "Public Announcements",
    members: 150,
    lastMsg: "Owner: New session on Monday",
    time: "Oct 12",
    unread: 0,
  },
];

const ChatGroups = () => {
  const navigate = useNavigate();
  const { demoId } = useParams();

  return (
    <div className={styles.chatPageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoChatbubblesOutline />
          </div>
          <div>
            <h1 className={styles.title}>Chat Channels</h1>
            <p className={styles.description}>
              Connect with your department teams and the workspace community.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.groupsGrid}>
        {MOCK_GROUPS.map((group) => (
          <div
            key={group.id}
            className={styles.groupCard}
            onClick={() => navigate(`/demos/${demoId}/chats/${group.id}`)}
          >
            <div className={styles.cardTop}>
              <div className={styles.groupAvatar}>{group.name.charAt(0)}</div>
              {group.unread > 0 && (
                <span className={styles.unreadBadge}>{group.unread}</span>
              )}
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.groupName}>{group.name}</h3>
              <div className={styles.memberCount}>
                <IoPeopleOutline /> <span>{group.members} Members</span>
              </div>
              <p className={styles.lastMsgPreview}>{group.lastMsg}</p>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.lastTime}>{group.time}</span>
              <button className={styles.enterChatBtn}>
                Open Chat <IoChevronForwardOutline />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatGroups;
