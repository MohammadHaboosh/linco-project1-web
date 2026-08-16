import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  IoAddOutline,
  IoRefreshOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { useDemo } from "../../../../../hooks/useDemo";
import { useLiveStreams } from "../../hooks/useLiveStreams";
import {
  buildLiveRoomPath,
  canManageLiveStreams,
} from "../../utils/liveStreamUtils";
import LiveCard from "../LiveCard/LiveCard";
import ScheduleLiveModal from "../ScheduleLiveModal/ScheduleLiveModal";
import styles from "./LivesContent.module.css";

const LivesContent = () => {
  const { t } = useTranslation();
  const { demoId, departmentId } = useParams();
  const { role, currentRoleView } = useDemo();
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const {
    streams,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    refetch,
    loadMore,
    createLiveStream,
  } = useLiveStreams({ demoId, departmentId });

  const canManage = canManageLiveStreams(role, currentRoleView);

  const filteredStreams = useMemo(
    () =>
      streams.filter((stream) => {
        const status = String(stream.status || "").toUpperCase();
        return activeTab === "ENDED"
          ? status === "ENDED"
          : status === "LIVE" || status === "SCHEDULED";
      }),
    [activeTab, streams],
  );

  const handleCreate = useCallback(
    async (streamData) => {
      await createLiveStream(streamData);
      setFeedback("live-created-successfully");
      setActiveTab("ACTIVE");
    },
    [createLiveStream],
  );

  useEffect(() => {
    const refreshVisibleStreams = () => {
      if (document.visibilityState === "visible") {
        refetch({ silent: true }).catch(() => {
          // The hook exposes the request error in its own error state.
        });
      }
    };

    document.addEventListener("visibilitychange", refreshVisibleStreams);
    return () =>
      document.removeEventListener("visibilitychange", refreshVisibleStreams);
  }, [refetch]);

  const retryLoad = async () => {
    try {
      await refetch();
    } catch {
      // The hook exposes the request error in its own error state.
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoVideocamOutline className={styles.headerIcon} />
          </div>
          <div>
            <span className={styles.subHeading}>
              {t("interactive-learning")}
            </span>
            <h1 className={styles.pageTitle}>{t("live-streams")}</h1>
            <p className={styles.pageDescription}>
              {t(
                "join-interactive-sessions-ask-questions-in-real-time-and-watch-past-recordings",
              )}
            </p>
          </div>
        </div>

        {canManage && (
          <button
            type="button"
            className={styles.createBtn}
            onClick={() => {
              setFeedback(null);
              setShowScheduleModal(true);
            }}
            aria-haspopup="dialog"
          >
            <IoAddOutline className={styles.btnIcon} /> {t("schedule-live")}
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <div>
            <strong>{t("live-streams-load-failed")}</strong>
            <span>{t(error)}</span>
          </div>
          {demoId && departmentId && (
            <button type="button" onClick={retryLoad} disabled={isLoading}>
              <IoRefreshOutline aria-hidden="true" /> {t("try-again")}
            </button>
          )}
        </div>
      )}

      {feedback && (
        <div className={styles.successBanner} role="status" aria-live="polite">
          {t(feedback)}
        </div>
      )}

      <div
        className={styles.tabsContainer}
        role="tablist"
        aria-label={t("filter-live-streams")}
      >
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === "ACTIVE" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("ACTIVE")}
          role="tab"
          id="live-stream-tab-active"
          aria-selected={activeTab === "ACTIVE"}
          aria-controls="live-stream-list"
        >
          {t("upcoming-and-live")}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === "ENDED" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("ENDED")}
          role="tab"
          id="live-stream-tab-ended"
          aria-selected={activeTab === "ENDED"}
          aria-controls="live-stream-list"
        >
          {t("ended-sessions")}
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loadingState} role="status" aria-live="polite">
          <span className={styles.loadingSpinner} aria-hidden="true" />
          <p>{t("loading-live-streams")}</p>
        </div>
      ) : (
        <>
          {filteredStreams.length > 0 ? (
            <div
              id="live-stream-list"
              className={styles.livesGrid}
              role="tabpanel"
              aria-labelledby={`live-stream-tab-${activeTab.toLowerCase()}`}
            >
              {filteredStreams.map((stream) => (
                <LiveCard
                  key={stream.id}
                  live={stream}
                  canManage={canManage}
                  roomPath={buildLiveRoomPath({
                    demoId,
                    departmentId,
                    streamId: stream.id,
                  })}
                />
              ))}
            </div>
          ) : (
            <div
              id="live-stream-list"
              className={styles.emptyState}
              role="tabpanel"
              aria-labelledby={`live-stream-tab-${activeTab.toLowerCase()}`}
            >
              <IoVideocamOutline aria-hidden="true" />
              <p>{t("no-streams-available-in-this-category")}</p>
            </div>
          )}

          {hasNextPage && (
            <div className={styles.paginationArea}>
              <button
                type="button"
                className={styles.loadMoreButton}
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? t("loading-more") : t("load-more")}
              </button>
            </div>
          )}
        </>
      )}

      {showScheduleModal && (
        <ScheduleLiveModal
          onClose={() => setShowScheduleModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default LivesContent;
