import {
  IoArrowForwardOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoPlayOutline,
  IoRadioOutline,
  IoTimeOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useId } from "react";
import styles from "./LiveCard.module.css";

const getDurationInMinutes = (startedAt, endedAt) => {
  if (!startedAt || !endedAt) return null;

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }

  return Math.max(1, Math.round((end - start) / 60000));
};

const LiveCard = ({ live, canManage, roomPath }) => {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const normalizedStatus = String(live.status || "").toUpperCase();
  const scheduleDate = new Date(live.scheduledAt);
  const hasValidSchedule = !Number.isNaN(scheduleDate.getTime());
  const duration = getDurationInMinutes(live.startedAt, live.endedAt);
  const statusClass =
    normalizedStatus === "LIVE"
      ? styles.liveCard
      : normalizedStatus === "SCHEDULED"
        ? styles.scheduledCard
        : styles.endedCard;
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const dateLabel = hasValidSchedule
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(scheduleDate)
    : t("schedule-unavailable");
  const timeLabel =
    normalizedStatus === "LIVE"
      ? t("in-progress")
      : duration
        ? t("duration-minutes", {
            count: duration,
            formattedCount: new Intl.NumberFormat(locale).format(duration),
          })
        : hasValidSchedule
          ? new Intl.DateTimeFormat(locale, {
              hour: "2-digit",
              minute: "2-digit",
            }).format(scheduleDate)
          : t("time-unavailable");

  const getStatusBadge = () => {
    if (normalizedStatus === "LIVE") {
      return (
        <span className={`${styles.badge} ${styles.liveBadge}`}>
          <span className={styles.pulse} /> {t("live-now")}
        </span>
      );
    }

    if (normalizedStatus === "SCHEDULED") {
      return (
        <span className={`${styles.badge} ${styles.upcomingBadge}`}>
          {t("scheduled")}
        </span>
      );
    }

    return (
      <span className={`${styles.badge} ${styles.endedBadge}`}>
        {t("ended")}
      </span>
    );
  };

  const getActionLabel = () => {
    if (normalizedStatus === "LIVE") return t("join-stream");
    if (normalizedStatus === "SCHEDULED" && canManage) {
      return t("start-live-stream");
    }
    if (normalizedStatus === "SCHEDULED") return t("stream-scheduled");
    return t("stream-ended");
  };

  const canUsePrimaryAction =
    normalizedStatus === "LIVE" ||
    (normalizedStatus === "SCHEDULED" && canManage);

  const actionContent = (
    <>
      <span className={styles.buttonContent}>
        {normalizedStatus === "LIVE" ? (
          <IoVideocamOutline />
        ) : normalizedStatus === "SCHEDULED" && canManage ? (
          <IoPlayOutline />
        ) : (
          <IoCheckmarkCircleOutline />
        )}
        {getActionLabel()}
      </span>
      {canUsePrimaryAction && (
        <IoArrowForwardOutline
          className={styles.actionArrow}
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <article
      className={`${styles.card} ${statusClass}`}
      aria-labelledby={titleId}
    >
      <div className={styles.visual}>
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.gridPattern} aria-hidden="true" />

        <div className={styles.visualHeader}>{getStatusBadge()}</div>

        <div className={styles.broadcastMark} aria-hidden="true">
          <span className={styles.broadcastRing} />
          <span className={styles.broadcastIcon}>
            {normalizedStatus === "LIVE" ? (
              <IoRadioOutline />
            ) : normalizedStatus === "SCHEDULED" ? (
              <IoVideocamOutline />
            ) : (
              <IoCheckmarkCircleOutline />
            )}
          </span>
        </div>

        <div className={styles.visualFooter}>
          <span>{t("interactive-learning")}</span>
          <span className={styles.signalBars} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 id={titleId} className={styles.title} title={live.title}>
          {live.title || t("untitled-live-stream")}
        </h3>
        <p
          className={styles.description}
          title={live.description || t("no-live-description")}
        >
          {live.description || t("no-live-description")}
        </p>

        <div className={styles.metaPanel}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon} aria-hidden="true">
              <IoCalendarOutline />
            </span>
            <span>{dateLabel}</span>
          </span>
          <span className={styles.metaDivider} aria-hidden="true" />
          <span className={styles.metaItem}>
            <span className={styles.metaIcon} aria-hidden="true">
              {normalizedStatus === "LIVE" ? (
                <IoRadioOutline />
              ) : (
                <IoTimeOutline />
              )}
            </span>
            <span>{timeLabel}</span>
          </span>
        </div>

        {canUsePrimaryAction ? (
          <a
            className={`${styles.mainBtn} ${
              normalizedStatus === "LIVE" ? styles.joinLiveBtn : ""
            }`}
            href={roomPath}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              normalizedStatus === "LIVE"
                ? t("join-named-stream-new-tab", {
                    title: live.title || t("untitled-live-stream"),
                  })
                : t("start-named-stream-new-tab", {
                    title: live.title || t("untitled-live-stream"),
                  })
            }
          >
            {actionContent}
          </a>
        ) : (
          <button type="button" className={styles.mainBtn} disabled>
            {actionContent}
          </button>
        )}
      </div>
    </article>
  );
};

export default LiveCard;
