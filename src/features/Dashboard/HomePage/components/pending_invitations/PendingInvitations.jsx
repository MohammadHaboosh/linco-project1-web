import styles from "./PendingInvitations.module.css";
import InvitationCard from "../../../../../components/elements/InvitationCard/InvitationCard.jsx";
import InvitationCardSkeleton from "../../../../../components/elements/InvitationCard/InvitationCardSkeleton.jsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../../routes/paths.js";
import { getApiErrorMessage } from "../../../../../utils/getApiErrorMessage";

const PendingInvitations = ({
  invitations,
  isLoading,
  error,
  onAccept,
  onReject,
  processingInvitationId,
  processingAction,
  actionError,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles["content-section"]}>
      <div className={styles["section-header"]}>
        <h2>{t("pending-invitations")}</h2>
        <button
          className={styles["view-all"]}
          onClick={() => navigate(PATHS.PENDING_INVITATIONS)}
        >
          {t("view-all-pending-invitations")}
        </button>
      </div>

      <div className={styles["list-container"]}>
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, idx) => (
              <InvitationCardSkeleton
                key={`inv-skeleton-${idx}`}
                compact={true}
              />
            ))
        ) : error ? (
          <p className={styles["empty-state"]} role="alert">
            {getApiErrorMessage(error, t("try-again-later"))}
          </p>
        ) : invitations.length === 0 ? (
          <p className={styles["empty-state"]}>{t("no-pending-invitations")}</p>
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
