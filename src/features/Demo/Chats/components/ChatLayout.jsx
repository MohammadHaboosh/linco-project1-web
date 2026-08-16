import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChatArea from "./ChatArea";
import { useDepartmentChat } from "../hooks/useDepartmentChat";
import styles from "./Chats.module.css";

const ChatLayout = ({ showHeader = true }) => {
  const { t, i18n } = useTranslation();
  const { demoId, departmentId, groupId } = useParams();
  const activeDepartmentId = departmentId || groupId;
  const chat = useDepartmentChat({ demoId, departmentId: activeDepartmentId });

  return (
    <div
      className={styles.chatPageWrapper}
      dir={i18n.dir()}
      aria-label={t("department-chat")}
    >
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
