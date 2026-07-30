import { useParams } from "react-router-dom";
import ChatArea from "./ChatArea";
import { useDepartmentChat } from "../hooks/useDepartmentChat";
import styles from "./Chats.module.css";

const ChatLayout = () => {
  const { demoId, departmentId } = useParams();
  const chat = useDepartmentChat({ demoId, departmentId });

  return (
    <div className={styles.chatPageWrapper}>
      <div className={styles.chatAppContainer}>
        <div className={styles.chatMainArea}>
          <ChatArea key={`${demoId}:${departmentId}`} {...chat} />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
