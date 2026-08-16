import { useParams } from "react-router-dom";
import ChatArea from "./ChatArea";
import { useDepartmentChat } from "../hooks/useDepartmentChat";
import styles from "./Chats.module.css";

const ChatLayout = ({ showHeader = true }) => {
  const { demoId, departmentId, groupId } = useParams();
  const activeDepartmentId = departmentId || groupId;
  const chat = useDepartmentChat({ demoId, departmentId: activeDepartmentId });

  return (
    <div className={styles.chatPageWrapper}>
      <div className={styles.chatAppContainer}>
        <div className={styles.chatMainArea}>
          <ChatArea
            key={`${demoId}:${activeDepartmentId}`}
            showHeader={showHeader}
            {...chat}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
