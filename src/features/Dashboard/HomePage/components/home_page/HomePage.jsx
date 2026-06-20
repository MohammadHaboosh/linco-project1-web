import Sidebar from "../../../../../components/layouts/SideBar/Sidebar";
import Header from "../../../../../components/layouts/Header/global_header/Header";
import Footer from "../../../../../components/layouts/Footer/Footer";
import PendingInvitations from "../pending_invitations/PendingInvitations";
import RoomSection from "../room_section/RoomSection";
import styles from "./HomePage.module.css";
import appIconImg from "../../../../../assets/icons/linco-logo.png";

const HomePage = () => {
  // Mock data arrays for the different room categories
  const activeRooms = [
    {
      id: 1,
      companyName: "Company Demo Name",
      role: "Trainee",
      dateJoined: "12/12/2025",
      members: 120,
    },
    {
      id: 2,
      companyName: "Company Demo Name",
      role: "Trainee",
      dateJoined: "12/12/2025",
      imageColor: "#1a365d",
      members: 120,
    },
  ];

  const ownedRooms = [
    {
      id: 1,
      companyName: "Company Demo Name",
      role: "Trainee",
      dateJoined: "12/12/2025",
      members: 120,
    },
    {
      id: 2,
      companyName: "Company Demo Name",
      role: "Trainee",
      dateJoined: "12/12/2025",
      members: 120,
    },
  ];

  const workedRooms = [
    {
      id: 1,
      companyName: "Company Demo Name",
      role: "Trainee",
      dateJoined: "12/12/2025",
      members: 120,
    },
    {
      id: 2,
      companyName: "Company Demo Name",
      role: "Trainee",
      dateJoined: "12/12/2025",
      members: 120,
    },
  ];

  return (
    <div className={styles["app-container"]}>
      <Sidebar role="global" />

      <div className={`${styles["main-wrapper"]} custom-scrollbar`}>
        <Header />
        <div className={styles["hero-banner"]}>
          <div className={styles["hero-text"]}>
            <h1>Ready to dive into your learning, Abrar ?</h1>
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

          <RoomSection title="Recently Active Owned Rooms" rooms={ownedRooms} />

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
