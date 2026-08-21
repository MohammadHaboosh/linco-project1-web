import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { AppAlertContext } from "./appAlertContext";
import styles from "./AppAlertProvider.module.css";

const ALERT_ICONS = {
  error: IoAlertCircleOutline,
  info: IoInformationCircleOutline,
  success: IoCheckmarkCircleOutline,
  warning: IoWarningOutline,
};

const ALERT_TITLE_KEYS = {
  error: "app-alert-error-title",
  info: "app-alert-info-title",
  success: "app-alert-success-title",
  warning: "app-alert-warning-title",
};

const ALERT_DURATIONS = {
  error: 6000,
  info: 5000,
  success: 5000,
  warning: 6000,
};

const normalizeAlertType = (type) =>
  Object.hasOwn(ALERT_ICONS, type) ? type : "info";

const AppAlertProvider = ({ children }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [confirmation, setConfirmation] = useState(null);
  const nextNotificationId = useRef(0);
  const confirmationResolver = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const cancelButtonRef = useRef(null);

  const dismissNotification = useCallback((id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }, []);

  const notify = useCallback((options) => {
    const normalizedOptions =
      typeof options === "string" ? { message: options } : options;
    const type = normalizeAlertType(normalizedOptions?.type);
    const message = normalizedOptions?.message;

    if (!message) return null;

    nextNotificationId.current += 1;
    const notification = {
      id: nextNotificationId.current,
      duration:
        normalizedOptions.duration === 0
          ? 0
          : normalizedOptions.duration || ALERT_DURATIONS[type],
      message,
      title: normalizedOptions.title,
      type,
    };

    setNotifications((current) => [...current, notification].slice(-4));
    return notification.id;
  }, []);

  const resolveConfirmation = useCallback((accepted) => {
    const resolve = confirmationResolver.current;
    confirmationResolver.current = null;
    setConfirmation(null);
    resolve?.(accepted);
  }, []);

  const confirmAction = useCallback((options) => {
    confirmationResolver.current?.(false);

    return new Promise((resolve) => {
      confirmationResolver.current = resolve;
      setConfirmation({
        cancelLabel: options?.cancelLabel,
        confirmLabel: options?.confirmLabel,
        message: options?.message,
        title: options?.title,
        tone: options?.tone || "danger",
      });
    });
  }, []);

  useEffect(() => {
    if (!confirmation) return undefined;

    previouslyFocusedElement.current = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        resolveConfirmation(false);
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = cancelButtonRef.current?.closest('[role="alertdialog"]');
      const focusableElements = dialog?.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElement.current?.focus?.();
    };
  }, [confirmation, resolveConfirmation]);

  useEffect(
    () => () => {
      confirmationResolver.current?.(false);
      confirmationResolver.current = null;
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ confirmAction, dismissNotification, notify }),
    [confirmAction, dismissNotification, notify],
  );

  return (
    <AppAlertContext.Provider value={contextValue}>
      {children}

      {notifications.length > 0 && (
        <div
          className={styles.toastRegion}
          role="region"
          aria-label={t("app-alert-notifications-label")}
        >
          {notifications.map((notification) => {
            const Icon = ALERT_ICONS[notification.type];

            return (
              <NotificationToast
                key={notification.id}
                notification={notification}
                onDismiss={dismissNotification}
              >
                <Icon className={styles.toastIcon} aria-hidden="true" />
                <div className={styles.toastContent}>
                  <strong>
                    {notification.title ||
                      t(ALERT_TITLE_KEYS[notification.type])}
                  </strong>
                  <span>{notification.message}</span>
                </div>
                <button
                  type="button"
                  className={styles.toastClose}
                  onClick={() => dismissNotification(notification.id)}
                  aria-label={t("app-alert-dismiss-notification")}
                >
                  <IoCloseOutline aria-hidden="true" />
                </button>
              </NotificationToast>
            );
          })}
        </div>
      )}

      {confirmation && (
        <div
          className={styles.confirmationOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) resolveConfirmation(false);
          }}
        >
          <div
            className={styles.confirmationDialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="app-confirmation-title"
            aria-describedby="app-confirmation-message"
          >
            <div
              className={`${styles.confirmationIcon} ${styles[confirmation.tone]}`}
            >
              <IoWarningOutline aria-hidden="true" />
            </div>
            <h2 id="app-confirmation-title">
              {confirmation.title || t("app-alert-confirm-title")}
            </h2>
            <p id="app-confirmation-message">{confirmation.message}</p>
            <div className={styles.confirmationActions}>
              <button
                ref={cancelButtonRef}
                type="button"
                className={styles.cancelButton}
                onClick={() => resolveConfirmation(false)}
              >
                {confirmation.cancelLabel || t("cancel")}
              </button>
              <button
                type="button"
                className={`${styles.confirmButton} ${styles[confirmation.tone]}`}
                onClick={() => resolveConfirmation(true)}
              >
                {confirmation.confirmLabel || t("ok")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppAlertContext.Provider>
  );
};

const NotificationToast = ({ children, notification, onDismiss }) => {
  useEffect(() => {
    if (!notification.duration) return undefined;

    const timer = window.setTimeout(
      () => onDismiss(notification.id),
      notification.duration,
    );

    return () => window.clearTimeout(timer);
  }, [notification.duration, notification.id, onDismiss]);

  return (
    <div
      className={`${styles.toast} ${styles[notification.type]}`}
      role={
        ["error", "warning"].includes(notification.type) ? "alert" : "status"
      }
    >
      {children}
    </div>
  );
};

export default AppAlertProvider;
