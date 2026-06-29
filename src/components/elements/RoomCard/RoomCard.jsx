import { useNavigate } from "react-router-dom";
import { IoPersonOutline, IoCalendarOutline, IoPeople } from "react-icons/io5";
import styles from "./RoomCard.module.css";
import { PATHS } from "../../../routes/paths";
import { useTranslation } from "react-i18next";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCardClick = () => {
    ////////////////////////////////////////
    /// const tempDemoId = ;
    navigate(`/demos/019f0fe8-d807-73b9-a0c7-891a13776c4b`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {/* Top half with image and info */}
      <div className={styles["card-top"]}>
        <div
          className={styles["card-image"]}
          style={room.imageColor ? { backgroundColor: room.imageColor } : {}}
        ></div>
        <div className={styles["card-info"]}>
          <h3>{room.companyName}</h3>
          <p>
            <IoPersonOutline className={styles.icon} /> {t("role")} {room.role}
          </p>
          <p>
            <IoCalendarOutline className={styles.icon} /> {t("joined-at")}{" "}
            {room.dateJoined}
          </p>
        </div>
      </div>

      {/* Horizontal line */}
      <hr className={styles["card-divider"]} />

      {/* Bottom half with badge */}
      <div className={styles["card-bottom"]}>
        <div className={styles["member-badge"]}>
          <IoPeople className={styles["badge-icon"]} />
          {room.members || 120}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
