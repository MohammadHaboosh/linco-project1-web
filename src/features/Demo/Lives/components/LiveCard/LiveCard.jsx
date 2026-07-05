import {
  IoTimeOutline,
  IoPersonOutline,
  IoEyeOutline,
  IoPlayCircleOutline,
  IoTrashOutline,
  IoPencilOutline,
} from "react-icons/io5";
import styles from "./LiveCard.module.css";
import { useTranslation } from "react-i18next";

const LiveCard = ({ live, canManage }) => {
  const { t } = useTranslation();
  const getStatusBadge = () => {
    if (live.status === "LIVE") {
      return (
        <div className={`${styles.badge} ${styles.liveBadge}`}>
          <span className={styles.pulse}></span> {t("live-now")}
        </div>
      );
    }
    if (live.status === "UPCOMING") {
      return (
        <div className={`${styles.badge} ${styles.upcomingBadge}`}>
          {t("upcoming")}
        </div>
      );
    }
    return (
      <div className={`${styles.badge} ${styles.recordedBadge}`}>
        {t("recorded")}
      </div>
    );
  };

  const dateObj = new Date(live.date);
  const formattedDate = dateObj.toLocaleDateString();
  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img
          src={live.thumbnail}
          alt={live.title}
          className={styles.thumbnail}
        />
        <div className={styles.overlay}></div>
        {getStatusBadge()}

        <IoPlayCircleOutline className={styles.playIconHover} />
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.title}>{live.title}</h3>

        <div className={styles.infoRow}>
          <span className={styles.infoItem}>
            <IoPersonOutline /> {live.instructor}
          </span>
          <span className={styles.infoItem}>
            <IoEyeOutline /> {live.viewers}{" "}
            {live.status === "RECORDED" ? t("views") : t("watching")}
          </span>
        </div>

        <div className={styles.timeRow}>
          <IoTimeOutline className={styles.timeIcon} />
          <span>
            {formattedDate} • {formattedTime}
          </span>
        </div>

        <div className={styles.actionArea}>
          <button
            className={`${styles.mainBtn} ${live.status === "LIVE" ? styles.joinLiveBtn : ""}`}
          >
            {live.status === "LIVE"
              ? t("join-stream")
              : live.status === "UPCOMING"
                ? t("set-reminder")
                : t("watch-replay")}
          </button>

          {canManage && (
            <div className={styles.adminActions}>
              <button className={styles.iconBtn} title={t("edit-stream")}>
                <IoPencilOutline />
              </button>
              <button
                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                title={t("delete-stream")}
              >
                <IoTrashOutline />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveCard;
