import {
  IoPeopleOutline,
  IoGlobeOutline,
  IoLockClosedOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import styles from "./Groups.module.css";
import { useTranslation } from "react-i18next";

const GroupCard = ({ group }) => {
  const { t } = useTranslation();
  const isPrivate = group.privacy === "PRIVATE";
  const groupName = group.name || group.title || "";

  return (
    <div className={styles.groupCard}>
      <div className={styles.cardHeader}>
        <div className={styles.groupTitleWrapper}>
          <div className={styles.groupIcon}>
            {groupName.substring(0, 2).toUpperCase()}
          </div>
          <h3 className={styles.groupName}>{groupName}</h3>
        </div>
        <span
          className={`${styles.privacyBadge} ${isPrivate ? styles.privateBadge : styles.publicBadge}`}
        >
          {isPrivate ? <IoLockClosedOutline /> : <IoGlobeOutline />}
          <span className={styles.privacyText}>
            {isPrivate ? t("private", "Private") : t("public", "Public")}
          </span>
        </span>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.groupDesc}>
          {group.description ||
            t(
              "no-description-provided",
              "No description provided for this workspace.",
            )}
        </p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.membersCount}>
          <IoPeopleOutline />
          <span>
            {group.membersCount || 0} {t("members", "Members")}
          </span>
        </div>
        <Link to={`/groups/${group.id}`} className={styles.joinBtn}>
          {t("enter-group", "Enter")} <IoArrowForwardOutline />
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;
