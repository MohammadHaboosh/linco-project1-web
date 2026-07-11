import { useTranslation } from "react-i18next";
import { IoTimeOutline } from "react-icons/io5";
import styles from "./InvitationCard.module.css";

const InvitationCard = ({
  invitation,
  compact = false,
  onAccept,
  onReject,
  isProcessing = false,
  processingAction,
  actionError,
}) => {
  const { t } = useTranslation();

  const acceptLabel =
    isProcessing && processingAction === "accept"
      ? t("accepting", "Accepting...")
      : t("accept");
  const rejectLabel =
    isProcessing && processingAction === "reject"
      ? t("rejecting", "Rejecting...")
      : t("reject");

  if (compact) {
    return (
      <div className={`${styles["list-item"]} ${styles["compact-card"]}`}>
        <div className={styles["compact-header"]}>
          <span className={styles["company-name"]}>{invitation.company}</span>
          <span className={styles["compact-time"]}>
            <IoTimeOutline
              style={{ marginBottom: "-2px", marginRight: "4px" }}
            />
            {invitation.time}
          </span>
        </div>

        <div className={styles["compact-details"]}>
          <span className={styles["compact-caller"]}>
            {t("from")}: {invitation.caller}
          </span>
          <span className={styles["compact-role"]}>{invitation.role}</span>
        </div>

        <div
          className={`${styles["list-actions"]} ${styles["compact-actions"]}`}
        >
          <button
            type="button"
            className={styles["btn-accept"]}
            onClick={() => onAccept?.(invitation.id)}
            disabled={isProcessing}
            aria-busy={isProcessing && processingAction === "accept"}
          >
            {acceptLabel}
          </button>
          <button
            type="button"
            className={styles["btn-reject"]}
            onClick={() => onReject?.(invitation.id)}
            disabled={isProcessing}
            aria-busy={isProcessing && processingAction === "reject"}
          >
            {rejectLabel}
          </button>
        </div>

        {actionError && (
          <p className={styles["action-error"]} role="alert">
            {actionError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles["list-item"]}>
      <div className={styles["company-name"]}>{invitation.company}</div>
      <div className={styles["vertical-divider"]}></div>
      <div className={styles["text-item"]}>{invitation.caller}</div>
      <div className={styles["vertical-divider"]}></div>
      <div className={styles["text-item"]}>{invitation.role}</div>
      <div className={styles["vertical-divider"]}></div>
      <div className={styles["text-item"]}>{invitation.time}</div>

      <div className={styles["list-actions"]}>
        <button
          type="button"
          className={styles["btn-accept"]}
          onClick={() => onAccept?.(invitation.id)}
          disabled={isProcessing}
          aria-busy={isProcessing && processingAction === "accept"}
        >
          {acceptLabel}
        </button>
        <button
          type="button"
          className={styles["btn-reject"]}
          onClick={() => onReject?.(invitation.id)}
          disabled={isProcessing}
          aria-busy={isProcessing && processingAction === "reject"}
        >
          {rejectLabel}
        </button>
      </div>

      {actionError && (
        <p className={styles["action-error"]} role="alert">
          {actionError}
        </p>
      )}
    </div>
  );
};

export default InvitationCard;
