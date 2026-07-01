import Sidebar from "../../../../../components/layouts/SideBar/Sidebar";
import Header from "../../../../../components/layouts/Header/global_header/Header";
import Footer from "../../../../../components/layouts/Footer/Footer";
import PendingInvitations from "../pending_invitations/PendingInvitations";
import RoomSection from "../room_section/RoomSection";
import styles from "./HomePage.module.css";
import appIconImg from "../../../../../../public/icons/linco-logo.png";

import { useUser } from "../../../../../hooks/useUser";
import { useHomePage } from "../../hooks/useHomePage.jsx";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const { profile } = useUser();
  const { ownedRooms, isLoadingOwnedRooms, activeRooms, workedRooms } =
    useHomePage();

  return (
    <div className={styles["app-container"]}>
      <div className={`${styles["main-wrapper"]} custom-scrollbar`}>
        <div className={styles["hero-banner"]}>
          <div className={styles["hero-text"]}>
            <h1>
              {t("ready-to-dive-into-your-learning")}{" "}
              {profile?.firstName || t("guest")} ?
            </h1>
            <p>
              {t(
                "manage-your-company-links-track-your-active-training-rooms-and-level-up-your-career-from-one-single-dashboard-1",
              )}
            </p>
          </div>
          <img
            src={appIconImg}
            alt="App Icon"
            className={styles["app-icon-img"]}
          />
        </div>

        <PendingInvitations />

        <div
          className={styles["content-section"]}
          style={{ paddingTop: "40px" }}
        >
          <RoomSection title={t("recently-active-rooms")} rooms={activeRooms} />

          <div className={styles.divider}></div>

          <div className={styles["owned-rooms-container"]}>
            {isLoadingOwnedRooms ? (
              <p style={{ padding: "0 40px", color: "#64748b" }}>
                {t("loading-your-rooms")}
              </p>
            ) : (
              <RoomSection
                title={t("recently-active-owned-rooms")}
                rooms={ownedRooms}
                viewAllPath="/my-own-rooms"
                emptyMessage={t("no-owned-rooms-yet")}
                emptySubtext={t(
                  "you-dont-have-any-active-owned-rooms-right-now-create-one-to-get-started",
                )}
              />
            )}
          </div>

          <div className={styles.divider}></div>

          <RoomSection
            title={t("recently-active-worked-rooms")}
            rooms={workedRooms}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
