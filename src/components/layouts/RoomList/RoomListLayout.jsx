import { useState } from "react";
import { IoChevronBack, IoSearch, IoFolderOpenOutline } from "react-icons/io5"; 
import Sidebar from "../SideBar/Sidebar.jsx";
import Header from "../Header/global_header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import RoomCard from "../../elements/RoomCard/RoomCard.jsx";
import styles from "./RoomListLayout.module.css";

const RoomsListLayout = ({
  title,
  statsTitle,
  rooms,
  bannerImage,
  onBackClick,
  emptyMessage = "No rooms found", 
  emptySubtext = "There are no rooms to display here at the moment.", 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter((room) =>
    room.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles["app-container"]}>
      <Sidebar role="global" />

      <div className={`${styles["main-wrapper"]} custom-scrollbar`}>
        <Header />

        <div className={styles["top-banner"]}>
          <div className={styles["banner-text"]}>
            <div className={styles["title-container"]}>
              <div
                className={styles["back-link"]}
                onClick={onBackClick}
                style={{ cursor: "pointer" }}
              >
                <IoChevronBack className={styles["back-icon"]} />
                <h2>{title}</h2>
              </div>
              <div className={styles["dashed-line"]}></div>
            </div>

            <div className={styles["stats-box"]}>
              <p className={styles["stats-title"]}>{statsTitle}</p>
              <p className={styles["stats-number"]}>{rooms.length}</p>
            </div>
          </div>

          <div className={styles["banner-image-container"]}>
            <img
              src={bannerImage}
              alt="Page banner"
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
          {rooms.length === 0 ? (
            <div className={styles["empty-state-wrapper"]}>
              <div className={styles["empty-state-card"]}>
                <IoFolderOpenOutline className={styles["empty-icon"]} />
                <h3>{emptyMessage}</h3>
                <p>{emptySubtext}</p>
              </div>
            </div>
          ) : (
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
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  No companies found matching "{searchQuery}"
                </p>
              )}
            </div>
          )}
        </div>

        <div className={styles["footer-wrapper"]}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default RoomsListLayout;
