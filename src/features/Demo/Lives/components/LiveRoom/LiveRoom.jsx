import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoPlayOutline,
  IoRadioOutline,
  IoRefreshOutline,
  IoStopCircleOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { useDemo } from "../../../../../hooks/useDemo";
import { useUser } from "../../../../../hooks/useUser";
import { liveStreamsApi } from "../../api/liveStreamsApi";
import {
  buildLiveStreamsPath,
  canManageLiveStreams,
} from "../../utils/liveStreamUtils";
import styles from "./LiveRoom.module.css";

const LiveRoom = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { demoId, departmentId, streamId } = useParams();
  const { role, currentRoleView, isLoading: isDemoLoading } = useDemo();
  const { profile } = useUser();
  const meetingApiRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const canManage = canManageLiveStreams(role, currentRoleView);
  const normalizedStatus = String(stream?.status || "").toUpperCase();
  const meetingConfig = useMemo(
    () => ({
      readOnlyName: true,
      disableProfile: true,
      hideConferenceSubject: true,
      disableInviteFunctions: true,
      hiddenPremeetingButtons: ["invite"],
      deeplinking: {
        disabled: true,
      },
      prejoinConfig: {
        enabled: true,
        hideDisplayName: true,
      },
    }),
    [],
  );
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
  const scheduleLabel = (() => {
    if (!stream?.scheduledAt) return null;

    const scheduledDate = new Date(stream.scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) return null;

    return scheduledDate.toLocaleString(i18n.resolvedLanguage, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  })();

  const prepareMeeting = useCallback(
    async (currentStream, signal) => {
      setIsConnecting(true);
      const tokenData = await liveStreamsApi.generateToken({
        demoId,
        departmentId,
        streamId: currentStream.id,
        signal,
      });

      if (!signal?.aborted) {
        setCredentials(tokenData);
      }
    },
    [demoId, departmentId],
  );

  const loadRoom = useCallback(
    async (signal) => {
      setIsPreparing(true);
      setRequestError(null);
      setConnectionError(null);
      setCredentials(null);
      setIsConnecting(false);
      meetingApiRef.current?.dispose?.();
      meetingApiRef.current = null;

      try {
        const currentStream = await liveStreamsApi.getById({
          demoId,
          departmentId,
          streamId,
          signal,
        });

        if (signal?.aborted) return;

        setStream(currentStream);

        if (String(currentStream.status || "").toUpperCase() === "LIVE") {
          await prepareMeeting(currentStream, signal);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !signal?.aborted) {
          setRequestError(error.message || t("live-join-failed"));
          setIsConnecting(false);
        }
      } finally {
        if (!signal?.aborted) {
          setIsPreparing(false);
        }
      }
    },
    [demoId, departmentId, prepareMeeting, streamId, t],
  );

  useEffect(() => {
    const controller = new AbortController();
    const initializeRoom = async () => {
      await loadRoom(controller.signal);
    };

    initializeRoom();
    return () => controller.abort();
  }, [loadRoom]);

  useEffect(() => {
    if (!credentials) return undefined;

    const connectionTimeout = window.setTimeout(() => {
      if (!meetingApiRef.current) {
        setConnectionError(t("live-room-connection-failed"));
        setIsConnecting(false);
      }
    }, 15000);

    return () => window.clearTimeout(connectionTimeout);
  }, [credentials, t]);

  useEffect(
    () => () => {
      meetingApiRef.current?.dispose?.();
      meetingApiRef.current = null;
    },
    [],
  );

  const leaveRoom = useCallback(() => {
    meetingApiRef.current?.executeCommand?.("hangup");
    meetingApiRef.current = null;
    window.close();

    window.setTimeout(() => {
      if (!window.closed) {
        navigate(buildLiveStreamsPath({ demoId, departmentId }), {
          replace: true,
        });
      }
    }, 120);
  }, [demoId, departmentId, navigate]);

  const startRoom = async () => {
    if (!stream || isStarting) return;

    setIsStarting(true);
    setRequestError(null);

    try {
      const startedStream = await liveStreamsApi.start({
        demoId,
        departmentId,
        streamId: stream.id,
      });
      setStream(startedStream);
      await prepareMeeting(startedStream);
    } catch (error) {
      setRequestError(error.message || t("live-join-failed"));
      setIsConnecting(false);
    } finally {
      setIsStarting(false);
    }
  };

  const endRoom = async () => {
    if (!stream || isEnding) return;

    setIsEnding(true);
    setRequestError(null);

    try {
      await liveStreamsApi.end({
        demoId,
        departmentId,
        streamId: stream.id,
      });
      leaveRoom();
    } catch (error) {
      setRequestError(error.message || t("live-end-failed"));
      setIsEnding(false);
    }
  };

  const handleApiReady = useCallback((meetingApi) => {
    meetingApiRef.current = meetingApi;
    setConnectionError(null);
    setIsConnecting(false);
  }, []);

  const sizeMeetingFrame = useCallback((meetingFrame) => {
    meetingFrame.style.width = "100%";
    meetingFrame.style.height = "100%";
  }, []);

  const renderRoomState = () => {
    if (isDemoLoading || isPreparing) {
      return (
        <div className={styles.connectionState} aria-live="polite">
          <span className={styles.spinner} />
          <strong>{t("loading-live-streams")}</strong>
          <p>{t("camera-permission-help")}</p>
        </div>
      );
    }

    if (requestError && !credentials) {
      return (
        <div className={styles.errorState} role="alert">
          <span className={`${styles.stateIcon} ${styles.errorIcon}`}>
            <IoVideocamOutline />
          </span>
          <strong>{t("unable-to-open-live-stream")}</strong>
          <p>{requestError}</p>
          <div className={styles.stateActions}>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={() => loadRoom()}
            >
              <IoRefreshOutline /> {t("try-again")}
            </button>
            <button
              type="button"
              className={styles.secondaryAction}
              onClick={leaveRoom}
            >
              <IoArrowBackOutline /> {t("leave-live-stream")}
            </button>
          </div>
        </div>
      );
    }

    if (normalizedStatus === "SCHEDULED") {
      return (
        <div className={styles.scheduledState}>
          <span className={styles.stateIcon}>
            <IoVideocamOutline />
          </span>
          <span className={styles.eyebrow}>{t("interactive-learning")}</span>
          <strong>{stream.title}</strong>
          <p>{stream.description || t("no-live-description")}</p>
          {scheduleLabel && (
            <span className={styles.scheduleDetail}>
              <IoCalendarOutline /> {scheduleLabel}
            </span>
          )}
          {requestError && (
            <div className={styles.inlineError} role="alert">
              {requestError}
            </div>
          )}
          <div className={styles.stateActions}>
            {canManage && (
              <button
                type="button"
                className={styles.primaryAction}
                onClick={startRoom}
                disabled={isStarting}
              >
                {isStarting ? (
                  <span className={styles.buttonSpinner} />
                ) : (
                  <IoPlayOutline />
                )}
                {isStarting ? t("starting-live") : t("start-live-stream")}
              </button>
            )}
            <button
              type="button"
              className={styles.secondaryAction}
              onClick={leaveRoom}
              disabled={isStarting}
            >
              <IoArrowBackOutline /> {t("leave-live-stream")}
            </button>
          </div>
        </div>
      );
    }

    if (normalizedStatus === "ENDED") {
      return (
        <div className={styles.endedState}>
          <span className={styles.stateIcon}>
            <IoCheckmarkCircleOutline />
          </span>
          <strong>{t("stream-ended")}</strong>
          <p>{stream.description || t("no-live-description")}</p>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={leaveRoom}
          >
            <IoArrowBackOutline /> {t("leave-live-stream")}
          </button>
        </div>
      );
    }

    if (!credentials) {
      return (
        <div className={styles.errorState} role="alert">
          <span className={`${styles.stateIcon} ${styles.errorIcon}`}>
            <IoVideocamOutline />
          </span>
          <strong>{t("unable-to-open-live-stream")}</strong>
          <p>{t("stream-is-not-live")}</p>
        </div>
      );
    }

    return (
      <>
        {isConnecting && !connectionError && (
          <div className={styles.connectionState} aria-live="polite">
            <span className={styles.spinner} />
            <strong>{t("connecting-to-live-stream")}</strong>
            <p>{t("camera-permission-help")}</p>
          </div>
        )}

        {connectionError && (
          <div className={styles.errorState} role="alert">
            <span className={`${styles.stateIcon} ${styles.errorIcon}`}>
              <IoVideocamOutline />
            </span>
            <strong>{t("unable-to-open-live-stream")}</strong>
            <p>{connectionError}</p>
            <div className={styles.stateActions}>
              <button
                type="button"
                className={styles.primaryAction}
                onClick={() => loadRoom()}
              >
                <IoRefreshOutline /> {t("try-again")}
              </button>
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={leaveRoom}
              >
                <IoArrowBackOutline /> {t("leave-live-stream")}
              </button>
            </div>
          </div>
        )}

        <div
          className={styles.meetingNode}
          aria-hidden={Boolean(connectionError)}
        >
          <JaaSMeeting
            appId={credentials.appId}
            roomName={credentials.roomName}
            jwt={credentials.token}
            userInfo={meetingUserInfo}
            configOverwrite={meetingConfig}
            onApiReady={handleApiReady}
            onReadyToClose={leaveRoom}
            getIFrameRef={sizeMeetingFrame}
          />
        </div>
      </>
    );
  };

  return (
    <div className={styles.page}>
      <section className={styles.room} aria-labelledby="live-room-title">
        <header className={styles.header}>
          <div className={styles.streamInfo}>
            <span className={styles.brandMark} aria-hidden="true">
              <IoVideocamOutline />
            </span>
            <div className={styles.streamCopy}>
              <div className={styles.titleRow}>
                {normalizedStatus && (
                  <span
                    className={`${styles.statusIndicator} ${
                      normalizedStatus === "LIVE"
                        ? styles.liveIndicator
                        : normalizedStatus === "SCHEDULED"
                          ? styles.scheduledIndicator
                          : styles.endedIndicator
                    }`}
                  >
                    {normalizedStatus === "LIVE" && <IoRadioOutline />}
                    {normalizedStatus === "LIVE"
                      ? t("live-now")
                      : normalizedStatus === "SCHEDULED"
                        ? t("scheduled")
                        : t("ended")}
                  </span>
                )}
                <h1 id="live-room-title">
                  {stream?.title || t("live-streams")}
                </h1>
              </div>
              <p>{stream?.description || t("interactive-learning")}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {normalizedStatus === "LIVE" && canManage && (
              <button
                type="button"
                className={styles.endButton}
                onClick={endRoom}
                disabled={isEnding}
              >
                <IoStopCircleOutline />
                {isEnding ? t("ending-live") : t("end-live-stream")}
              </button>
            )}
            <button
              type="button"
              className={styles.closeButton}
              onClick={leaveRoom}
              disabled={isEnding}
              aria-label={t("leave-live-stream")}
              title={t("leave-live-stream")}
            >
              <IoCloseOutline />
            </button>
          </div>
        </header>

        {requestError && credentials && (
          <div className={styles.roomError} role="alert">
            {requestError}
          </div>
        )}

        <main className={styles.meetingArea}>{renderRoomState()}</main>
      </section>
    </div>
  );
};

export default LiveRoom;
