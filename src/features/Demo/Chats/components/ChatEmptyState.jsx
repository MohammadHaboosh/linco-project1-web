import { IoChatbubbles } from "react-icons/io5";
import styles from "./Chats.module.css";
import { useTranslation } from "react-i18next";

const ChatEmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyIconCircle}>
        <IoChatbubbles />
      </div>
      <h3>{t("your-workspace-chats")}</h3>
      <p>
        {t(
          "select-a-channel-from-the-left-menu-to-start-collaborating-and-sharing-ideas-with-your-team",
        )}
      </p>
    </div>
  );
};

export default ChatEmptyState;
