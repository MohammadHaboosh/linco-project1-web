import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoMailUnreadOutline,
  IoSearchOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import InvitationCard from "../../../../components/elements/InvitationCard/InvitationCard";
import { usePendingInvitations } from "../hooks/usePendingInvitations.jsx";
import styles from "./PendingInvitations.module.css";

const PendingInvitationsContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    invitations,
    isLoading,
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
      {/* 1. الترويسة الفخمة */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoMailUnreadOutline className={styles.headerIcon} />
            {invitations.length > 0 && (
              <span className={styles.badge}>{invitations.length}</span>
            )}
          </div>
          <div>
            <h1 className={styles.title}>
              {t("pending-invitations", "Pending Invitations")}
            </h1>
            <p className={styles.description}>
              {t(
                "review-and-manage-invitations",
                "Review and manage your workspace invitations. Accept to join or reject to decline.",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 2. شريط البحث والأدوات */}
      <div className={styles.controlsSection}>
        <div className={styles.searchBox}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t(
              "search-invitations",
              "Search by company or sender name...",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* 3. قائمة الدعوات */}
      <div className={styles.listSection}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <span className={styles.loader}></span>
            <p>{t("loading-invitations", "Loading invitations...")}</p>
          </div>
        ) : filteredInvitations.length === 0 ? (
          // حالة عدم وجود دعوات (Empty State)
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              <IoCheckmarkDoneOutline />
            </div>
            <h3>{t("all-caught-up", "You're all caught up!")}</h3>
            <p>
              {t(
                "no-pending-invitations",
                "You don't have any pending invitations matching your search at the moment.",
              )}
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
