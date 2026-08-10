import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCloseOutline,
  IoRadioOutline,
  IoStopCircleOutline,
} from "react-icons/io5";
import styles from "./LiveRoom.module.css";

const scriptPromises = new Map();

const loadJaasApi = (appId) => {
  if (window.JitsiMeetExternalAPI) {
    return Promise.resolve(window.JitsiMeetExternalAPI);
  }

  if (scriptPromises.has(appId)) {
    return scriptPromises.get(appId);
  }

  const scriptPromise = new Promise((resolve, reject) => {
    const scriptId = `jaas-external-api-${appId}`;
    let script = document.getElementById(scriptId);

    const handleLoad = () => {
      if (window.JitsiMeetExternalAPI) {
        resolve(window.JitsiMeetExternalAPI);
      } else {
        reject(new Error("The video meeting service did not initialize."));
      }
    };
    const handleError = () => {
      scriptPromises.delete(appId);
      script.remove();
      reject(new Error("Unable to load the video meeting service."));
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://8x8.vc/${encodeURIComponent(appId)}/external_api.js`;
      script.async = true;
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!script.isConnected) {
      document.head.appendChild(script);
    }
  });

  scriptPromises.set(appId, scriptPromise);
  return scriptPromise;
};

const LiveRoom = ({
  stream,
  credentials,
  canManage,
  isEnding,
  error,
  onClose,
  onEnd,
}) => {
  const { t } = useTranslation();
  const meetingNodeRef = useRef(null);
  const meetingApiRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    let isActive = true;

    const connectToRoom = async () => {
      setIsConnecting(true);
      setConnectionError(null);

      try {
        const JitsiMeetExternalAPI = await loadJaasApi(credentials.appId);

        if (!isActive || !meetingNodeRef.current) return;

        const meetingApi = new JitsiMeetExternalAPI("8x8.vc", {
          roomName: `${credentials.appId}/${credentials.roomName}`,
          jwt: credentials.token,
          parentNode: meetingNodeRef.current,
          width: "100%",
          height: "100%",
        });

        meetingApiRef.current = meetingApi;
        meetingApi.addListener?.("videoConferenceJoined", () => {
          if (isActive) setIsConnecting(false);
        });
        meetingApi.addListener?.("readyToClose", () => {
          if (isActive) onCloseRef.current();
        });

        window.setTimeout(() => {
          if (isActive) setIsConnecting(false);
        }, 4000);
      } catch (loadError) {
        if (isActive) {
          setConnectionError(
            loadError.message || t("live-room-connection-failed"),
          );
          setIsConnecting(false);
        }
      }
    };

    connectToRoom();

    return () => {
      isActive = false;
      meetingApiRef.current?.dispose?.();
      meetingApiRef.current = null;
    };
  }, [credentials, t]);

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
            ref={meetingNodeRef}
            className={styles.meetingNode}
            aria-hidden={Boolean(connectionError)}
          />
        </div>
      </section>
    </div>
  );
};

export default LiveRoom;
