import {
  IoCalendarOutline,
  IoPlayCircleOutline,
  IoRadioOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./LiveCard.module.css";

const LiveCard = ({ live }) => {
  const { t, i18n } = useTranslation();
  const isLive = String(live.status).toUpperCase() === "LIVE";
  const schedule = new Date(live.scheduledAt);
  const hasValidSchedule = !Number.isNaN(schedule.getTime());

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img src="/images/linco-logo.jpg" alt="" className={styles.image} />
        <IoPlayCircleOutline className={styles.playIcon} />
        <span
          className={`${styles.statusBadge} ${
            isLive ? styles.liveBadge : styles.scheduledBadge
          }`}
        >
          {isLive ? t("live-now") : t("scheduled")}
        </span>
      </div>
      <div className={styles.content}>
        <div>
          <h3 className={styles.title}>{live.title}</h3>
          <p className={styles.description}>{live.description}</p>
          <div className={styles.details}>
            <p>
              <IoCalendarOutline className={styles.icon} />
              {hasValidSchedule
                ? schedule.toLocaleDateString(i18n.resolvedLanguage)
                : t("schedule-unavailable")}
            </p>
            <p>
              {isLive ? (
                <IoRadioOutline className={styles.icon} />
              ) : (
                <IoTimeOutline className={styles.icon} />
              )}
              {isLive
                ? t("in-progress")
                : hasValidSchedule
                  ? schedule.toLocaleTimeString(i18n.resolvedLanguage, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : t("time-unavailable")}
            </p>
          </div>
        </div>
        <div className={styles.actionRow}>
          <Link className={styles.btn} to="lives">
            {isLive ? t("join-stream") : t("view-live-streams")}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default LiveCard;
