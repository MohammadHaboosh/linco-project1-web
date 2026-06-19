import { useState } from "react";
import { IoChevronBack, IoSearch } from "react-icons/io5";
import Sidebar from "../../../components/layouts/SideBar/Sidebar";
import Header from "../../../components/layouts/Header/Header";
import Footer from "../../../components/layouts/Footer/Footer";
import InvitationCard from "../../../components/elements/InvitationCard.jsx";
import styles from "./PendingInvitations.module.css";

const PendingInvitationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const invitations = [
    {
      id: 1,
      company: "Company name 1",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
    {
      id: 2,
      company: "Company name 2",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
    {
      id: 3,
      company: "Company name 3",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
    {
      id: 4,
      company: "Company name 4",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
    {
      id: 5,
      company: "Company name 5",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
    {
      id: 6,
      company: "Company name 6",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
  ];

  const filteredInvitations = invitations.filter((inv) =>
    inv.company.toLowerCase().includes(searchQuery.toLowerCase()),
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
                <h2>Pending Invitations</h2>
              </a>
              <div className={styles["dashed-line"]}></div>
            </div>
            <p>
              Review your pending invitations to join company
              <br />
              workspaces and training rooms.
            </p>
          </div>

          <div className={styles["banner-image-container"]}>
            <img
              src=""
              alt="Invitation to Linco company envelopes"
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
          <div className={styles["table-header"]}>
            <div className={styles["th-col"]} style={{ textAlign: "left" }}>
              COMPANY NAME
            </div>
            <div className={styles["th-col"]}>CALLER</div>
            <div className={styles["th-col"]}>ROLE</div>
            <div className={styles["th-col"]}>TIME</div>
            <div className={styles["th-col-action"]}>ACTION</div>
          </div>

          <div className={styles["list-container"]}>
            {filteredInvitations.length > 0 ? (
              filteredInvitations.map((inv) => (
                <InvitationCard key={inv.id} invitation={inv} />
              ))
            ) : (
              <p
                style={{
                  color: "#64748b",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No pending invitations found matching "{searchQuery}"
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

export default PendingInvitationsPage;
