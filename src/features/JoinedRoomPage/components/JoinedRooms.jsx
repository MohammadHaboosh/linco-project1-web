import { useState } from "react";
import { IoChevronBack, IoSearch } from "react-icons/io5";
import Sidebar from "../../../components/layouts/SideBar/Sidebar";
import Header from "../../../components/layouts/Header/Header";
import Footer from "../../../components/layouts/Footer/Footer";
import RoomCard from "../../../components/elements/RoomCard.jsx";
import styles from "./JoinedRooms.module.css";

const JoinedRoomsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const joinedRooms = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    companyName: `Company Demo Name ${index + 1}`,
    role: "Trainee",
    dateJoined: "12/12/2025",
    members: 120,
  }));

  const filteredRooms = joinedRooms.filter((room) =>
    room.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles["app-container"]}>
      <Sidebar />

      <div className={`${styles["main-wrapper"]} custom-scrollbar`}>
        <Header />

        <div className={styles["top-banner"]}>
          <div className={styles["banner-text"]}>
            <div className={styles["title-container"]}>
              <a href="#" className={styles["back-link"]}>
                <IoChevronBack className={styles["back-icon"]} />
                <h2>Joined Training Rooms</h2>
              </a>
              <div className={styles["dashed-line"]}></div>
            </div>

            <div className={styles["stats-box"]}>
              <p className={styles["stats-title"]}>
                Number of training companies
              </p>
              <p className={styles["stats-number"]}>{joinedRooms.length}</p>
            </div>
          </div>

          <div className={styles["banner-image-container"]}>
            <img
              src=""
              alt="Modern office building"
              className={styles["banner-image"]}
            />
          </div>
        </div>

        <div className={styles["search-section"]}>
          <div className={styles["search-bar"]}>
            <input
              type="text"
              placeholder="Search by company's name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IoSearch className={styles["search-icon"]} />
          </div>
        </div>

        <div className={styles["list-section"]}>
          <div className={styles["cards-grid"]}>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            ) : (
              <p
                style={{
                  color: "#64748b",
                  fontStyle: "italic",
                  gridColumn: "1 / -1",
                }}
              >
                No companies found matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        <div className={styles["footer-wrapper"]}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default JoinedRoomsPage;
