import { useParams } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatArea from "./ChatArea";
import ChatEmptyState from "./ChatEmptyState";
import styles from "./Chats.module.css";

const MOCK_GROUPS = [
  {
    id: "g1",
    name: "Front-End Developers",
    members: 12,
    lastMsg: "Omar: Check the new design!",
    time: "10:30 AM",
    unread: 3,
  },
  {
    id: "g2",
    name: "UI/UX Designers",
    members: 5,
    lastMsg: "Sara: The prototype is ready",
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

const ChatLayout = () => {
  const { chatId } = useParams();
  const activeGroup = MOCK_GROUPS.find((g) => g.id === chatId);

  return (
    <div className={styles.chatPageWrapper}>
      <div className={styles.chatAppContainer}>
        <ChatSidebar groups={MOCK_GROUPS} activeChatId={chatId} />

        <div className={styles.chatMainArea}>
          {activeGroup ? <ChatArea group={activeGroup} /> : <ChatEmptyState />}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
