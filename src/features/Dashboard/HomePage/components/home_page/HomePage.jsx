import { Trans, useTranslation } from "react-i18next";
import PendingInvitations from "../pending_invitations/PendingInvitations";
import RoomSection from "../room_section/RoomSection";
import styles from "./HomePage.module.css";
import { useUser } from "../../../../../hooks/useUser";
import { useHomePage } from "../../hooks/useHomePage.jsx";
import { PATHS } from "../../../../../routes/paths.js";

const HomePage = () => {
  const { t } = useTranslation();
  const { profile } = useUser();
  const {
    ownedRooms,
    isLoadingOwnedRooms,
    ownedRoomsError,
    activeRooms,
    isLoadingJoinedRooms,
    joinedRoomsError,
    pendingInvitations,
    isLoadingInvitations,
    invitationsError,
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
            <Trans
              i18nKey="home-greeting"
              values={{ name: profile?.firstName || t("guest") }}
              components={{
                name: <span className={styles.highlightName} />,
              }}
            />
          </h1>
          <p className={styles.bannerDesc}>{t("home-dashboard-description")}</p>
        </div>
        <div className={styles.bannerDecoration}></div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          <RoomSection
            title={t("owned-workspaces")}
            rooms={ownedRooms}
            isLoading={isLoadingOwnedRooms}
            error={ownedRoomsError}
            viewAllPath={PATHS.OWN_ROOMS}
            emptyMessage={t("no-owned-workspaces-yet")}
            emptySubtext={t("no-owned-workspaces-description")}
          />

          <div className={styles.sectionSpacer}></div>

          <RoomSection
            title={t("joined-workspaces")}
            rooms={activeRooms}
            isLoading={isLoadingJoinedRooms}
            error={joinedRoomsError}
            viewAllPath={PATHS.JOINED_ROOMS}
            emptyMessage={t("no-joined-workspaces-yet")}
            emptySubtext={t("no-joined-workspaces-description")}
          />
        </div>

        <div className={styles.sideColumn}>
          <PendingInvitations
            invitations={pendingInvitations}
            isLoading={isLoadingInvitations}
            error={invitationsError}
            onAccept={acceptInvitation}
            onReject={rejectInvitation}
            processingInvitationId={processingInvitationId}
            processingAction={processingAction}
            actionError={invitationActionError}
          />

          <div className={styles.quickStatsCard}>
            <h3>{t("quick-activity")}</h3>
            <p>
              {t("recent-workspaces-accessed", {
                count: activeRooms.length + ownedRooms.length,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
