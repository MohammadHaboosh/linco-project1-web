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
import styles from "./LiveStageAgenda.module.css";

const getStatus = (stream) => String(stream.status || "").toUpperCase();

const getDurationInMinutes = (startedAt, endedAt) => {
  if (!startedAt || !endedAt) return null;

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }

  return Math.max(1, Math.round((end - start) / 60000));
};

const LiveStageAgenda = ({
  streams,
  mode,
  canManage,
  demoId,
  departmentId,
}) => {
  const { t, i18n } = useTranslation();
  const isArchive = mode === "ENDED";
  const featuredStream = isArchive
    ? null
    : streams.find((stream) => getStatus(stream) === "LIVE") || streams[0];
  const agendaStreams = isArchive
    ? streams
    : streams.filter((stream) => stream.id !== featuredStream?.id);

  const getPresentation = (stream) => {
    const status = getStatus(stream);
    const scheduleDate = new Date(stream.scheduledAt);
    const hasValidSchedule = !Number.isNaN(scheduleDate.getTime());
    const duration = getDurationInMinutes(stream.startedAt, stream.endedAt);
    const day = hasValidSchedule
      ? scheduleDate.toLocaleDateString(i18n.resolvedLanguage, {
          day: "2-digit",
        })
      : "--";
    const month = hasValidSchedule
      ? scheduleDate.toLocaleDateString(i18n.resolvedLanguage, {
          month: "short",
        })
      : t("schedule-unavailable");
    const compactTime =
      status === "LIVE"
        ? t("in-progress")
        : duration
          ? t("duration-minutes", { count: duration })
          : hasValidSchedule
            ? scheduleDate.toLocaleTimeString(i18n.resolvedLanguage, {
                hour: "2-digit",
                minute: "2-digit",
              })
            : t("time-unavailable");
    const fullSchedule = hasValidSchedule
      ? scheduleDate.toLocaleString(i18n.resolvedLanguage, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : t("schedule-unavailable");
    const isLive = status === "LIVE";
    const isScheduled = status === "SCHEDULED";
    const canOpenRoom = isLive || (isScheduled && canManage);
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

    return {
      status,
      day,
      month,
      compactTime,
      fullSchedule,
      isLive,
      isScheduled,
      canOpenRoom,
      actionLabel,
      actionIcon,
      roomPath: buildLiveRoomPath({
        demoId,
        departmentId,
        streamId: stream.id,
      }),
    };
  };

  const renderAction = (presentation, className) => {
    const content = (
      <>
        <span>
          {presentation.actionIcon}
          {presentation.actionLabel}
        </span>
        {presentation.canOpenRoom && (
          <IoArrowForwardOutline
            className={styles.actionArrow}
            aria-hidden="true"
          />
        )}
      </>
    );

    return presentation.canOpenRoom ? (
      <a
        className={className}
        href={presentation.roomPath}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    ) : (
      <button type="button" className={className} disabled>
        {content}
      </button>
    );
  };

  const featuredPresentation = featuredStream
    ? getPresentation(featuredStream)
    : null;

  return (
    <div className={styles.experience}>
      {featuredStream && featuredPresentation && (
        <section
          className={`${styles.stage} ${
            featuredPresentation.isLive ? styles.liveStage : styles.nextStage
          }`}
          aria-labelledby={`featured-stream-${featuredStream.id}`}
        >
          <span className={styles.stageGlow} aria-hidden="true" />
          <span className={styles.stageGrid} aria-hidden="true" />

          <div className={styles.stageContent}>
            <span className={styles.stageKicker}>
              {featuredPresentation.isLive ? (
                <>
                  <span className={styles.liveDot} /> {t("live-now")}
                </>
              ) : (
                <>
                  <IoCalendarOutline /> {t("upcoming")}
                </>
              )}
            </span>

            <h2 id={`featured-stream-${featuredStream.id}`}>
              {featuredStream.title}
            </h2>
            <p>{featuredStream.description || t("no-live-description")}</p>

            <span className={styles.featuredTime}>
              <IoCalendarOutline /> {featuredPresentation.fullSchedule}
            </span>

            {renderAction(featuredPresentation, styles.stageAction)}
          </div>

          <div className={styles.stageVisual} aria-hidden="true">
            <span className={styles.signalRing}>
              <i />
              <i />
              <i />
              <span className={styles.signalCore}>
                {featuredPresentation.isLive ? (
                  <IoRadioOutline />
                ) : (
                  <IoVideocamOutline />
                )}
              </span>
            </span>
            <span className={styles.signalBars}>
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
        </section>
      )}

      {agendaStreams.length > 0 && (
        <section className={styles.agenda} aria-label={t("live-streams")}>
          <header className={styles.agendaHeader}>
            <div>
              <span>{t("interactive-learning")}</span>
              <h2>
                {isArchive ? t("ended-sessions") : t("upcoming-and-live")}
              </h2>
            </div>
            <strong className={styles.sessionCount}>{agendaStreams.length}</strong>
          </header>

          <div className={styles.agendaList}>
            {agendaStreams.map((stream) => {
              const presentation = getPresentation(stream);

              return (
                <article
                  key={stream.id}
                  className={`${styles.agendaRow} ${
                    presentation.isLive
                      ? styles.liveAgendaRow
                      : presentation.isScheduled
                        ? styles.scheduledAgendaRow
                        : styles.endedAgendaRow
                  }`}
                >
                  <div className={styles.dateBlock}>
                    <strong>{presentation.day}</strong>
                    <span>{presentation.month}</span>
                    <small>{presentation.compactTime}</small>
                  </div>

                  <div className={styles.agendaContent}>
                    <div className={styles.agendaTitleLine}>
                      <span className={styles.rowStatus}>
                        {presentation.isLive
                          ? t("live-now")
                          : presentation.isScheduled
                            ? t("scheduled")
                            : t("ended")}
                      </span>
                      <h3 title={stream.title}>{stream.title}</h3>
                    </div>
                    <p title={stream.description || t("no-live-description")}>
                      {stream.description || t("no-live-description")}
                    </p>
                  </div>

                  <div className={styles.rowActionCell}>
                    {renderAction(presentation, styles.rowAction)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default LiveStageAgenda;
