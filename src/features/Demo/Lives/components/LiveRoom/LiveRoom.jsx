import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { useTranslation } from "react-i18next";
import {
  IoCloseOutline,
  IoRadioOutline,
  IoStopCircleOutline,
} from "react-icons/io5";
import styles from "./LiveRoom.module.css";

const LiveRoom = ({
  stream,
  credentials,
  userInfo,
  canManage,
  isEnding,
  error,
  onClose,
  onEnd,
}) => {
  const { t } = useTranslation();
  const meetingApiRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
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

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const connectionTimeout = window.setTimeout(() => {
      if (!meetingApiRef.current) {
        setConnectionError(t("live-room-connection-failed"));
        setIsConnecting(false);
      }
    }, 15000);

    return () => window.clearTimeout(connectionTimeout);
  }, [t]);

  useEffect(
    () => () => {
      meetingApiRef.current?.dispose?.();
      meetingApiRef.current = null;
    },
    [],
  );

  const handleApiReady = useCallback((meetingApi) => {
    meetingApiRef.current = meetingApi;
    setConnectionError(null);
    setIsConnecting(false);
  }, []);

  const handleReadyToClose = useCallback(() => {
    onCloseRef.current();
  }, []);

  const sizeMeetingFrame = useCallback((meetingFrame) => {
    meetingFrame.style.width = "100%";
    meetingFrame.style.height = "100%";
  }, []);

  const leaveRoom = () => {
    meetingApiRef.current?.executeCommand?.("hangup");
    onClose();
  };

  const endRoom = async () => {
    const didEnd = await onEnd(stream.id);
    if (didEnd) {
      meetingApiRef.current?.executeCommand?.("hangup");
      onClose();
    }
  };

  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.room}
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-room-title"
      >
        <header className={styles.header}>
          <div className={styles.streamInfo}>
            <span className={styles.liveIndicator}>
              <IoRadioOutline /> {t("live-now")}
            </span>
            <div>
              <h2 id="live-room-title">{stream.title}</h2>
              <p>{stream.description}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {canManage && (
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

        {error && (
          <div className={styles.roomError} role="alert">
            {error}
          </div>
        )}

        <div className={styles.meetingArea}>
          {isConnecting && !connectionError && (
            <div className={styles.connectionState} aria-live="polite">
              <span className={styles.spinner} />
              <strong>{t("connecting-to-live-stream")}</strong>
              <p>{t("camera-permission-help")}</p>
            </div>
          )}

          {connectionError && (
            <div className={styles.errorState} role="alert">
              <strong>{t("unable-to-open-live-stream")}</strong>
              <p>{connectionError}</p>
              <button type="button" onClick={leaveRoom}>
                {t("close")}
              </button>
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
              userInfo={userInfo}
              configOverwrite={meetingConfig}
              onApiReady={handleApiReady}
              onReadyToClose={handleReadyToClose}
              getIFrameRef={sizeMeetingFrame}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiveRoom;
