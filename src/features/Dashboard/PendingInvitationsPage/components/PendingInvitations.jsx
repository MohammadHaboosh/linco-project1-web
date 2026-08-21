import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoMailUnreadOutline,
  IoSearchOutline,
  IoCheckmarkDoneOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import InvitationCard from "../../../../components/elements/InvitationCard/InvitationCard";
import InvitationCardSkeleton from "../../../../components/elements/InvitationCard/InvitationCardSkeleton";
import { usePendingInvitations } from "../hooks/usePendingInvitations.jsx";
import styles from "./PendingInvitations.module.css";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

const PendingInvitationsContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    invitations,
    isLoading,
    error,
    acceptInvitation,
    rejectInvitation,
    processingInvitationId,
    processingAction,
    actionError,
  } = usePendingInvitations();

  const filteredInvitations = invitations.filter(
    (inv) =>
      inv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.caller.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoMailUnreadOutline className={styles.headerIcon} />
            {invitations.length > 0 && !isLoading && (
              <span className={styles.badge}>{invitations.length}</span>
            )}
          </div>
          <div>
            <h1 className={styles.title}>{t("pending-invitations")}</h1>
            <p className={styles.description}>
              {t("review-and-manage-invitations")}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.searchBox}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t("search-invitations")}
            aria-label={t("search-invitations")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.listSection}>
        {isLoading ? (
          <div className={styles.invitationsGrid}>
            {Array(6)
              .fill(0)
              .map((_, idx) => (
                <InvitationCardSkeleton
                  key={`full-inv-skeleton-${idx}`}
                  compact={false}
                />
              ))}
          </div>
        ) : error ? (
          <div className={styles.emptyState} role="alert">
            <div className={styles.emptyIconBox}>
              <IoAlertCircleOutline />
            </div>
            <h3>{t("unable-to-load-invitations")}</h3>
            <p>{getApiErrorMessage(error, t("try-again-later"))}</p>
          </div>
        ) : filteredInvitations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              <IoCheckmarkDoneOutline />
            </div>
            <h3>{searchQuery ? t("no-results-found") : t("all-caught-up")}</h3>
            <p>
              {searchQuery
                ? t("no-invitations-match-search")
                : t("no-pending-invitations")}
            </p>
          </div>
        ) : (
          <div className={styles.invitationsGrid}>
            {filteredInvitations.map((inv) => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                compact={false}
                onAccept={acceptInvitation}
                onReject={rejectInvitation}
                isProcessing={processingInvitationId === inv.id}
                processingAction={processingAction}
                actionError={
                  actionError?.invitationId === inv.id
                    ? actionError.message
                    : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingInvitationsContent;
