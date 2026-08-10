import {
  IoCalendarOutline,
  IoPlayCircleOutline,
  IoRadioOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
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

const LiveCard = ({ live, canManage, onPrimaryAction, pendingAction }) => {
  const { t, i18n } = useTranslation();
  const normalizedStatus = String(live.status || "").toUpperCase();
  const scheduleDate = new Date(live.scheduledAt);
  const hasValidSchedule = !Number.isNaN(scheduleDate.getTime());
  const duration = getDurationInMinutes(live.startedAt, live.endedAt);
  const isPending = Boolean(pendingAction);

  const getStatusBadge = () => {
    if (normalizedStatus === "LIVE") {
      return (
        <div className={`${styles.badge} ${styles.liveBadge}`}>
          <span className={styles.pulse} /> {t("live-now")}
        </div>
      );
    }

    if (normalizedStatus === "SCHEDULED") {
      return (
        <div className={`${styles.badge} ${styles.upcomingBadge}`}>
          {t("scheduled")}
        </div>
      );
    }

    return (
      <div className={`${styles.badge} ${styles.endedBadge}`}>
        {t("ended")}
      </div>
    );
  };

  const getActionLabel = () => {
    if (pendingAction === "starting") return t("starting-live");
    if (pendingAction === "joining") return t("joining-live");
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

  return (
    <article className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img
          src="/images/linco-logo.jpg"
          alt=""
          className={styles.thumbnail}
        />
        <div className={styles.overlay} />
        {getStatusBadge()}
        {canUsePrimaryAction && (
          <IoPlayCircleOutline className={styles.playIconHover} />
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.title}>{live.title}</h3>
        <p className={styles.description}>
          {live.description || t("no-live-description")}
        </p>

        <div className={styles.details}>
          <span className={styles.infoItem}>
            <IoCalendarOutline />
            {hasValidSchedule
              ? scheduleDate.toLocaleDateString(i18n.resolvedLanguage)
              : t("schedule-unavailable")}
          </span>
          <span className={styles.infoItem}>
            {normalizedStatus === "LIVE" ? (
              <IoRadioOutline />
            ) : (
              <IoTimeOutline />
            )}
            {normalizedStatus === "LIVE"
              ? t("in-progress")
              : duration
                ? t("duration-minutes", { count: duration })
                : hasValidSchedule
                  ? scheduleDate.toLocaleTimeString(i18n.resolvedLanguage, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : t("time-unavailable")}
          </span>
        </div>

        <button
          type="button"
          className={`${styles.mainBtn} ${
            normalizedStatus === "LIVE" ? styles.joinLiveBtn : ""
          }`}
          onClick={() => onPrimaryAction(live)}
          disabled={!canUsePrimaryAction || isPending}
        >
          {isPending && <span className={styles.buttonSpinner} />}
          {getActionLabel()}
        </button>
      </div>
    </article>
  );
};

export default LiveCard;
