import Sidebar from "../../../../../components/layouts/SideBar/Sidebar";
import Header from "../../../../../components/layouts/Header/global_header/Header";
import Footer from "../../../../../components/layouts/Footer/Footer";
import PendingInvitations from "../pending_invitations/PendingInvitations";
import RoomSection from "../room_section/RoomSection";
import styles from "./HomePage.module.css";
import appIconImg from "../../../../../../public/icons/linco-logo.png";

import { useUser } from "../../../../../hooks/useUser";
import { useHomePage } from "../../hooks/useHomePage.jsx";

const HomePage = () => {
  const { profile } = useUser();
  const { ownedRooms, isLoadingOwnedRooms, activeRooms, workedRooms } =
    useHomePage();

  return (
    <div className={styles["app-container"]}>
      <Sidebar role="global" />

      <div className={`${styles["main-wrapper"]} custom-scrollbar`}>
        <Header />
        <div className={styles["hero-banner"]}>
          <div className={styles["hero-text"]}>
            <h1>
              Ready to dive into your learning, {profile?.firstName || "Guest"}{" "}
              ?
            </h1>
            <p>
              Manage your company links, track your active training rooms, and
              level up your career from one single dashboard.
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
          <RoomSection title="Recently Active Rooms" rooms={activeRooms} />

          <div className={styles.divider}></div>

          <div className={styles["owned-rooms-container"]}>
            {isLoadingOwnedRooms ? (
              <p style={{ padding: "0 40px", color: "#64748b" }}>
                Loading your rooms...
              </p>
            ) : (
              <RoomSection
                title="Recently Active Owned Rooms"
                rooms={ownedRooms}
                viewAllPath="/my-own-rooms"
                emptyMessage="No Owned Rooms Yet"
                emptySubtext="You don't have any active owned rooms right now. Create one to get started!"
              />
            )}
          </div>

          <div className={styles.divider}></div>

          <RoomSection
            title="Recently Active Worked Rooms"
            rooms={workedRooms}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
