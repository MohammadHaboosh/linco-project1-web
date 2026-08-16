import { useParams, Link } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import styles from "./Groups.module.css";
import ChatLayout from "../../Chats/components/ChatLayout";

const GroupWorkspace = () => {
  const { groupId } = useParams();

  const groupDetails = {
    name: "React Developers",
    description:
      "Discussing advanced React patterns, hooks, and modern web development architectures.",
    membersCount: 142,
  };

  return (
    <div className={styles.workspaceContainer}>
      <aside className={styles.workspaceSidebar}>
        <Link to="/groups" className={styles.backLink}>
          <IoArrowBackOutline /> Back to Groups
        </Link>

        <div className={styles.groupInfoBox}>
          <div className={styles.groupAvatarBig}>
            {groupDetails.name.substring(0, 2).toUpperCase()}
          </div>
          <h2 className={styles.workspaceTitle}>{groupDetails.name}</h2>

          <div className={styles.workspaceMeta}>
            <span className={styles.metaItem}>
              <IoPeopleOutline /> {groupDetails.membersCount} Members
            </span>
          </div>

          <div className={styles.workspaceAbout}>
            <h3>
              <IoInformationCircleOutline /> About this group
            </h3>
            <p>{groupDetails.description}</p>
          </div>
        </div>
      </aside>

      <main className={styles.chatAreaContainer}>
        <ChatLayout />
      </main>
    </div>
  );
};

export default GroupWorkspace;
