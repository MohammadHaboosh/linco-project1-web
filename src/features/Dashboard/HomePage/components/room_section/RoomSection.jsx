import { useNavigate } from "react-router-dom";
import { IoFolderOpenOutline } from "react-icons/io5";
import RoomCard from "../../../../../components/elements/RoomCard/RoomCard.jsx";
import RoomCardSkeleton from "../../../../../components/elements/RoomCard/RoomCardSkeleton.jsx";
import styles from "./RoomSection.module.css";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../../../utils/getApiErrorMessage";

const RoomSection = ({
  title,
  rooms,
  viewAllPath,
  emptyMessage,
  emptySubtext,
  isLoading,
  error,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.section}>
      <div className={styles["section-header"]}>
        <h2>{title}</h2>
        {viewAllPath && rooms.length > 0 && !isLoading && (
          <button
            className={styles["view-all"]}
            onClick={() => navigate(viewAllPath)}
          >
            {t("view-all-workspaces")}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className={styles["cards-grid"]}>
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <RoomCardSkeleton key={`room-skeleton-${idx}`} />
            ))}
        </div>
      ) : error ? (
        <div className={styles["empty-state-card"]} role="alert">
          <IoFolderOpenOutline className={styles["empty-icon"]} />
          <h3>{t("unable-to-load-workspaces")}</h3>
          <p>{getApiErrorMessage(error, t("try-again-later"))}</p>
        </div>
      ) : rooms.length > 0 ? (
        <div className={styles["cards-grid"]}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className={styles["empty-state-card"]}>
          <IoFolderOpenOutline className={styles["empty-icon"]} />
          <h3>{emptyMessage || t("no-rooms-found")}</h3>
          <p>
            {emptySubtext ||
              t("there-are-no-rooms-to-display-here-at-the-moment")}
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomSection;
