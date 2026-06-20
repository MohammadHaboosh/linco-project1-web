import { useNavigate } from "react-router-dom";
import { IoPersonOutline, IoCalendarOutline, IoPeople } from "react-icons/io5";
import styles from "./RoomCard.module.css";
import { PATHS } from "../../../routes/paths";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    ////////////////////////////////////////
    navigate(PATHS.DEMO);
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
            <IoPersonOutline className={styles.icon} /> Role: {room.role}
          </p>
          <p>
            <IoCalendarOutline className={styles.icon} /> Joined at{" "}
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
