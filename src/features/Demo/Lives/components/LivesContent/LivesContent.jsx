import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  IoAddOutline,
  IoRefreshOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { useDemo } from "../../../../../hooks/useDemo";
import { useUser } from "../../../../../hooks/useUser";
import { useLiveStreams } from "../../hooks/useLiveStreams";
import LiveCard from "../LiveCard/LiveCard";
import LiveRoom from "../LiveRoom/LiveRoom";
import ScheduleLiveModal from "../ScheduleLiveModal/ScheduleLiveModal";
import styles from "./LivesContent.module.css";

const MANAGER_ROLES = new Set(["owner", "admin", "sectionmanager"]);

const normalizeRole = (role) =>
  String(role || "")
    .replace(/[-_\s]/g, "")
    .toLowerCase();

const LivesContent = () => {
  const { t } = useTranslation();
  const { demoId, departmentId } = useParams();
  const { role, currentRoleView } = useDemo();
  const { profile } = useUser();
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [roomSession, setRoomSession] = useState(null);

  const {
    streams,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    refetch,
    loadMore,
    createLiveStream,
    startLiveStream,
    endLiveStream,
    getLiveStream,
    generateLiveStreamToken,
  } = useLiveStreams({ demoId, departmentId });

  const canManage = [role, currentRoleView]
    .map(normalizeRole)
    .some((candidateRole) => MANAGER_ROLES.has(candidateRole));

  const meetingUserInfo = useMemo(() => {
    const displayName = [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      displayName: displayName || profile?.email || "Participant",
      email: profile?.email || "",
    };
  }, [profile?.email, profile?.firstName, profile?.lastName]);

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
      setFeedback(t("live-created-successfully"));
      setActiveTab("ACTIVE");
    },
    [createLiveStream, t],
  );

  const handlePrimaryAction = useCallback(
    async (stream) => {
      const status = String(stream.status || "").toUpperCase();
      const action = status === "SCHEDULED" ? "starting" : "joining";

      setPendingAction({ streamId: stream.id, action });
      setActionError(null);
      setFeedback(null);

      try {
        let currentStream = stream;

        if (status === "SCHEDULED") {
          currentStream = await startLiveStream(stream.id);
        } else {
          currentStream = await getLiveStream(stream.id);
        }

        if (String(currentStream.status).toUpperCase() !== "LIVE") {
          throw new Error(t("stream-is-not-live"));
        }

        setPendingAction({ streamId: stream.id, action: "joining" });
        const credentials = await generateLiveStreamToken(stream.id);
        setRoomSession({ stream: currentStream, credentials });
      } catch (requestError) {
        setActionError(requestError.message || t("live-join-failed"));
      } finally {
        setPendingAction(null);
      }
    },
    [generateLiveStreamToken, getLiveStream, startLiveStream, t],
  );

  const handleEndLiveStream = useCallback(
    async (streamId) => {
      setPendingAction({ streamId, action: "ending" });
      setActionError(null);

      try {
        await endLiveStream(streamId);
        setFeedback(t("live-ended-successfully"));
        setActiveTab("ENDED");
        return true;
      } catch (requestError) {
        setActionError(requestError.message || t("live-end-failed"));
        return false;
      } finally {
        setPendingAction(null);
      }
    },
    [endLiveStream, t],
  );

  const closeRoom = useCallback(() => {
    setRoomSession(null);
  }, []);

  const retryLoad = async () => {
    setActionError(null);
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
            onClick={() => setShowScheduleModal(true)}
          >
            <IoAddOutline className={styles.btnIcon} /> {t("schedule-live")}
          </button>
        )}
      </div>

      {(actionError || error) && (
        <div className={styles.errorBanner} role="alert">
          <span>{actionError || error}</span>
          {error && (
            <button type="button" onClick={retryLoad} disabled={isLoading}>
              <IoRefreshOutline /> {t("try-again")}
            </button>
          )}
        </div>
      )}

      {feedback && (
        <div className={styles.successBanner} role="status" aria-live="polite">
          {feedback}
        </div>
      )}

      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === "ACTIVE" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("ACTIVE")}
        >
          {t("upcoming-and-live")}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === "ENDED" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("ENDED")}
        >
          {t("ended-sessions")}
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loadingState} aria-live="polite">
          <span className={styles.loadingSpinner} />
          <p>{t("loading-live-streams")}</p>
        </div>
      ) : (
        <>
          <div className={styles.livesGrid}>
            {filteredStreams.length > 0 ? (
              filteredStreams.map((stream) => (
                <LiveCard
                  key={stream.id}
                  live={stream}
                  canManage={canManage}
                  onPrimaryAction={handlePrimaryAction}
                  pendingAction={
                    pendingAction?.streamId === stream.id
                      ? pendingAction.action
                      : null
                  }
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <IoVideocamOutline />
                <p>{t("no-streams-available-in-this-category")}</p>
              </div>
            )}
          </div>

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

      {roomSession && (
        <LiveRoom
          stream={roomSession.stream}
          credentials={roomSession.credentials}
          userInfo={meetingUserInfo}
          canManage={canManage}
          isEnding={
            pendingAction?.streamId === roomSession.stream.id &&
            pendingAction.action === "ending"
          }
          error={actionError}
          onClose={closeRoom}
          onEnd={handleEndLiveStream}
        />
      )}
    </div>
  );
};

export default LivesContent;
