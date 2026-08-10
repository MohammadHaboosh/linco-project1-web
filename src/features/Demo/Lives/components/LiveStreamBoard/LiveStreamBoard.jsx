import { useTranslation } from "react-i18next";
import {
  IoArrowForwardOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoPlayOutline,
  IoRadioOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { buildLiveRoomPath } from "../../utils/liveStreamUtils";
import styles from "./LiveStreamBoard.module.css";

const getDurationInMinutes = (startedAt, endedAt) => {
  if (!startedAt || !endedAt) return null;

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }

  return Math.max(1, Math.round((end - start) / 60000));
};

const LiveStreamBoard = ({
  streams,
  mode,
  canManage,
  demoId,
  departmentId,
}) => {
  const { t, i18n } = useTranslation();
  const liveCount = streams.filter(
    (stream) => String(stream.status || "").toUpperCase() === "LIVE",
  ).length;
  const scheduledCount = streams.filter(
    (stream) => String(stream.status || "").toUpperCase() === "SCHEDULED",
  ).length;

  return (
    <section className={styles.board} aria-label={t("live-streams")}>
      <div className={styles.boardHeader}>
        <div>
          <span className={styles.boardEyebrow}>
            {t("interactive-learning")}
          </span>
          <h2>
            {mode === "ENDED" ? t("ended-sessions") : t("upcoming-and-live")}
          </h2>
        </div>

        <div className={styles.boardSummary}>
          {mode === "ENDED" ? (
            <span className={`${styles.summaryItem} ${styles.endedSummary}`}>
              <IoCheckmarkCircleOutline />
              <strong>{streams.length}</strong>
              {t("ended")}
            </span>
          ) : (
            <>
              <span className={`${styles.summaryItem} ${styles.liveSummary}`}>
                <span className={styles.liveDot} />
                <strong>{liveCount}</strong>
                {t("live-now")}
              </span>
              <span className={styles.summaryItem}>
                <IoCalendarOutline />
                <strong>{scheduledCount}</strong>
                {t("scheduled")}
              </span>
            </>
          )}
        </div>
      </div>

      <div className={styles.scheduleList}>
        {streams.map((stream, index) => {
          const status = String(stream.status || "").toUpperCase();
          const scheduleDate = new Date(stream.scheduledAt);
          const hasValidSchedule = !Number.isNaN(scheduleDate.getTime());
          const duration = getDurationInMinutes(
            stream.startedAt,
            stream.endedAt,
          );
          const isLive = status === "LIVE";
          const isScheduled = status === "SCHEDULED";
          const canOpenRoom = isLive || (isScheduled && canManage);
          const dayLabel = hasValidSchedule
            ? scheduleDate.toLocaleDateString(i18n.resolvedLanguage, {
                day: "2-digit",
              })
            : "--";
          const monthLabel = hasValidSchedule
            ? scheduleDate.toLocaleDateString(i18n.resolvedLanguage, {
                month: "short",
              })
            : t("schedule-unavailable");
          const timeLabel = isLive
            ? t("in-progress")
            : duration
              ? t("duration-minutes", { count: duration })
              : hasValidSchedule
                ? scheduleDate.toLocaleTimeString(i18n.resolvedLanguage, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : t("time-unavailable");
          const roomPath = buildLiveRoomPath({
            demoId,
            departmentId,
            streamId: stream.id,
          });
          const actionLabel = isLive
            ? t("join-stream")
            : isScheduled && canManage
              ? t("start-live-stream")
              : isScheduled
                ? t("stream-scheduled")
                : t("stream-ended");
          const actionIcon = isLive ? (
            <IoVideocamOutline />
          ) : isScheduled && canManage ? (
            <IoPlayOutline />
          ) : (
            <IoCheckmarkCircleOutline />
          );

          return (
            <article
              key={stream.id}
              className={`${styles.sessionRow} ${
                isLive
                  ? styles.liveRow
                  : isScheduled
                    ? styles.scheduledRow
                    : styles.endedRow
              }`}
            >
              {isLive && (
                <span className={styles.broadcastGraphic} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              )}

              <div className={styles.dateColumn}>
                <strong>{dayLabel}</strong>
                <span>{monthLabel}</span>
                <small>{timeLabel}</small>
              </div>

              <div className={styles.timelineTrack} aria-hidden="true">
                <span className={styles.timelineNode}>
                  {isLive ? (
                    <IoRadioOutline />
                  ) : isScheduled ? (
                    <IoCalendarOutline />
                  ) : (
                    <IoCheckmarkCircleOutline />
                  )}
                </span>
                {index < streams.length - 1 && (
                  <span className={styles.timelineLine} />
                )}
              </div>

              <div className={styles.sessionContent}>
                <div className={styles.sessionTitleLine}>
                  <span className={styles.statusLabel}>
                    {isLive
                      ? t("live-now")
                      : isScheduled
                        ? t("scheduled")
                        : t("ended")}
                  </span>
                  <h3 title={stream.title}>{stream.title}</h3>
                </div>
                <p title={stream.description || t("no-live-description")}>
                  {stream.description || t("no-live-description")}
                </p>
              </div>

              <div className={styles.actionCell}>
                {canOpenRoom ? (
                  <a
                    className={styles.sessionAction}
                    href={roomPath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      {actionIcon}
                      {actionLabel}
                    </span>
                    <IoArrowForwardOutline className={styles.actionArrow} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className={styles.sessionAction}
                    disabled
                  >
                    <span>
                      {actionIcon}
                      {actionLabel}
                    </span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default LiveStreamBoard;
