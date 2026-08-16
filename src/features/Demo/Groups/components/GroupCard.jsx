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

  return (
    <div className={styles.groupCard}>
      <div className={styles.cardHeader}>
        <div className={styles.groupIcon}>
          {group.name.substring(0, 2).toUpperCase()}
        </div>
        <span
          className={`${styles.privacyBadge} ${isPrivate ? styles.privateBadge : styles.publicBadge}`}
        >
          {isPrivate ? <IoLockClosedOutline /> : <IoGlobeOutline />}
          {isPrivate ? t("private", "Private") : t("public", "Public")}
        </span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.groupName}>{group.name}</h3>
        <p className={styles.groupDesc}>{group.description}</p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.membersCount}>
          <IoPeopleOutline />
          <span>
            {group.membersCount} {t("members", "Members")}
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
