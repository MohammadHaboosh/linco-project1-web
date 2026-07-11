import { useTranslation } from "react-i18next";
import PendingInvitations from "../pending_invitations/PendingInvitations";
import RoomSection from "../room_section/RoomSection";
import styles from "./HomePage.module.css";
import { useUser } from "../../../../../hooks/useUser";
import { useHomePage } from "../../hooks/useHomePage.jsx";

const HomePage = () => {
  const { t } = useTranslation();
  const { profile } = useUser();
  const {
    ownedRooms,
    isLoadingOwnedRooms,
    activeRooms,
    pendingInvitations,
    isLoadingInvitations,
    acceptInvitation,
    rejectInvitation,
    processingInvitationId,
    processingAction,
    invitationActionError,
  } = useHomePage();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.greeting}>
            {t("ready-to-dive-into-your-learning")}{" "}
            <span className={styles.highlightName}>
              {profile?.firstName || t("guest")}
            </span>
            !
          </h1>
          <p className={styles.bannerDesc}>
            {t(
              "manage-your-company-links-track-your-active-training-rooms-and-level-up-your-career-from-one-single-dashboard-1",
            )}
          </p>
        </div>
        <div className={styles.bannerDecoration}></div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          {isLoadingOwnedRooms ? (
            <div className={styles.loadingState}>
              {t("loading-your-rooms", "Loading your workspaces...")}
            </div>
          ) : (
            <RoomSection
              title={t("recently-active-owned-rooms", "My Workspaces")}
              rooms={ownedRooms}
              viewAllPath="/my-own-rooms"
              emptyMessage={t("no-owned-rooms-yet")}
              emptySubtext={t(
                "you-dont-have-any-active-owned-rooms-right-now-create-one-to-get-started",
              )}
            />
          )}

          <div className={styles.sectionSpacer}></div>

          <RoomSection
            title={t("recently-active-rooms", "Joined Workspaces")}
            rooms={activeRooms}
          />
        </div>

        <div className={styles.sideColumn}>
          <PendingInvitations
            invitations={pendingInvitations}
            isLoading={isLoadingInvitations}
            onAccept={acceptInvitation}
            onReject={rejectInvitation}
            processingInvitationId={processingInvitationId}
            processingAction={processingAction}
            actionError={invitationActionError}
          />

          <div className={styles.quickStatsCard}>
            <h3>{t("quick-activity")}</h3>
            <p>
              {t("you-have-accessed")} {activeRooms.length + ownedRooms.length}{" "}
              {t("workspaces-recently")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
