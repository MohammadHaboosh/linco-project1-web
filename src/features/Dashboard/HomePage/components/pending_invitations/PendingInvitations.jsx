import styles from "./PendingInvitations.module.css";
import InvitationCard from "../../../../../components/elements/InvitationCard/InvitationCard.jsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../../routes/paths.js";

const PendingInvitations = ({
  invitations,
  isLoading,
  onAccept,
  onReject,
  processingInvitationId,
  processingAction,
  actionError,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className={styles["content-section"]}
      style={{ background: "transparent" }}
    >
      <div className={styles["section-header"]}>
        <h2>{t("new-pending-invitations")}</h2>
        <button
          className={styles["view-all"]}
          onClick={() => navigate(PATHS.PENDING_INVITATIONS)}
        >
          {t("view-all-pending-invitations")}
        </button>
      </div>

      <div className={styles["list-container"]}>
        {isLoading ? (
          <div className={styles["loading-state"]}>
            <span className={styles.loader}></span>
            <p>{t("loading-invitations", "Loading invitations...")}</p>
          </div>
        ) : invitations.length === 0 ? (
          <p className={styles["empty-state"]}>
            {t("no-pending-invitations", "No pending invitations.")}
          </p>
        ) : (
          invitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              compact={true}
              onAccept={onAccept}
              onReject={onReject}
              isProcessing={processingInvitationId === invitation.id}
              processingAction={processingAction}
              actionError={
                actionError?.invitationId === invitation.id
                  ? actionError.message
                  : null
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PendingInvitations;
