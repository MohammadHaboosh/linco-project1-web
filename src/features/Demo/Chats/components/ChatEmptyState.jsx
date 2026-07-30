import { IoChatbubblesOutline } from "react-icons/io5";
import styles from "./Chats.module.css";
import { useTranslation } from "react-i18next";

const ChatEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyIconCircle}>
        <IoChatbubblesOutline />
      </div>
      <h3>{t("chat-no-messages")}</h3>
      <p>{t("chat-start-conversation")}</p>
    </div>
  );
};

export default ChatEmptyState;
