import RoomCard from "../../../../../components/elements/RoomCard/RoomCard.jsx";
import styles from "./RoomSection.module.css";

const RoomSection = ({ title, rooms }) => {
  return (
    <div className={styles.section}>
      <div className={styles["section-header"]}>
        <h2>{title}</h2>
        <button className={styles["view-all"]}>View All</button>
      </div>

      <div className={styles["cards-grid"]}>
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomSection;
