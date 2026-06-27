import { useNavigate } from "react-router-dom";
import { IoFolderOpenOutline } from "react-icons/io5"; // Added an icon for the empty state
import RoomCard from "../../../../../components/elements/RoomCard/RoomCard.jsx";
import styles from "./RoomSection.module.css";

const RoomSection = ({
  title,
  rooms,
  viewAllPath,
  emptyMessage,
  emptySubtext,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
      <div className={styles["section-header"]}>
        <h2>{title}</h2>
        {viewAllPath && rooms.length > 0 && (
          <button
            className={styles["view-all"]}
            onClick={() => navigate(viewAllPath)}
          >
            View All
          </button>
        )}
      </div>

      {rooms.length > 0 ? (
        <div className={styles["cards-grid"]}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className={styles["empty-state-card"]}>
          <IoFolderOpenOutline className={styles["empty-icon"]} />
          <h3>{emptyMessage || "No rooms found"}</h3>
          <p>
            {emptySubtext ||
              "There are no rooms to display here at the moment."}
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomSection;
