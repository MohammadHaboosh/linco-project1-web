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
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const isLive = String(live.status).toUpperCase() === "LIVE";
  const schedule = new Date(live.scheduledAt);
  const hasValidSchedule = !Number.isNaN(schedule.getTime());
  const formattedDate = hasValidSchedule
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(schedule)
    : t("schedule-unavailable");
  const formattedTime = hasValidSchedule
    ? new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(schedule)
    : t("time-unavailable");

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img src="/images/linco-logo.jpg" alt="" className={styles.image} />
        <IoPlayCircleOutline className={styles.playIcon} aria-hidden="true" />
        <span
          className={`${styles.statusBadge} ${
            isLive ? styles.liveBadge : styles.scheduledBadge
          }`}
          aria-label={
            isLive ? t("live-stream-status-live") : t("live-stream-status-scheduled")
          }
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
              <IoCalendarOutline className={styles.icon} aria-hidden="true" />
              {hasValidSchedule ? (
                <time dateTime={schedule.toISOString()}>{formattedDate}</time>
              ) : (
                formattedDate
              )}
            </p>
            <p>
              {isLive ? (
                <IoRadioOutline className={styles.icon} aria-hidden="true" />
              ) : (
                <IoTimeOutline className={styles.icon} aria-hidden="true" />
              )}
              {isLive
                ? t("in-progress")
                : hasValidSchedule
                  ? <time dateTime={schedule.toISOString()}>{formattedTime}</time>
                  : t("time-unavailable")}
            </p>
          </div>
        </div>
        <div className={styles.actionRow}>
          <Link
            className={styles.btn}
            to="lives"
            aria-label={t(
              isLive ? "join-named-stream" : "view-named-stream",
              { title: live.title },
            )}
          >
            {isLive ? t("join-stream") : t("view-live-streams")}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default LiveCard;
