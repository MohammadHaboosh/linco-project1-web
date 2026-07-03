import { useNavigate } from "react-router-dom";
import {
  IoPersonOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoRocketOutline,
} from "react-icons/io5";
import styles from "./RoomCard.module.css";
import { PATHS } from "../../../routes/paths";
import { useTranslation } from "react-i18next";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCardClick = () => {
    navigate(PATHS.DEMO.replace(":demoId", room.id));
  };

  const displayName = room.name;
  const displayDesc = room.description || "_";
  const displayMembers = room.membersCount;
  const displayRole = room.isOwner ? "Owner" : room.role || "Member";
  const displayDate = room.createdAt
    ? new Date(room.createdAt).toLocaleDateString()
    : room.dateJoined || "";
  const displayPlan = room.plan || "FREE";
  const status = room.subscriptionStatus || "ACTIVE";

  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.cardHeader}>
        <div className={styles.brandSection}>
          <div className={styles.logoBox}>
            {room.imagePath && room.imagePath !== "qwertyuikol" ? (
              <img
                src={room.imagePath}
                alt={displayName}
                className={styles.logoImg}
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className={styles.titleBox}>
            <h3 className={styles.companyName}>{displayName}</h3>
            <span className={styles.roleTag}>
              <IoPersonOutline /> {displayRole}
            </span>
          </div>
        </div>

        <div className={styles.badgeSection}>
          <span
            className={`${styles.planBadge} ${styles[displayPlan.toLowerCase()]}`}
          >
            <IoRocketOutline /> {displayPlan}
          </span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.description}>{displayDesc}</p>
      </div>

      <hr className={styles.divider} />

      <div className={styles.cardFooter}>
        <div className={styles.footerItem}>
          <IoPeopleOutline className={styles.footerIcon} />
          <span>
            {displayMembers} {t("members", "Members")}
          </span>
        </div>

        <div className={styles.footerItem}>
          <span
            className={`${styles.statusDot} ${styles[status.toLowerCase()]}`}
          ></span>
          <span style={{ textTransform: "capitalize" }}>
            {status.toLowerCase()}
          </span>
        </div>

        {displayDate && (
          <div className={styles.footerItem}>
            <IoCalendarOutline className={styles.footerIcon} />
            <span>{displayDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
