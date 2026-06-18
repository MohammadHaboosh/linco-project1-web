import Sidebar from "../../../components/layouts/SideBar/Sidebar";
import Header from "../../../components/layouts/Header/Header";
import Footer from "../../../components/layouts/Footer/Footer";
import styles from "./HomePage.module.css";

import appIconImg from "../../../assets/icons/linco-logo.png";

const HomePage = () => {
  return (
    <div className={styles["app-container"]}>
      <Sidebar />

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

        <div
          className={styles["content-section"]}
          style={{ background: "transparent" }}
        >
          <div className={styles["section-header"]}>
            <h2>New pending Invitations</h2>
            <a href="#" className={styles["view-all"]}>
              View all
            </a>
          </div>

          <div className={styles["list-item"]}>
            <div className={styles["company-name"]}>Company name</div>
            <div>Name of the caller</div>
            <div>As a trainee</div>
            <div>13:40 pm</div>
            <div
              className={styles["list-actions"]}
              style={{ flex: 0.5, textAlign: "right" }}
            >
              <button className={styles["btn-accept"]}>Accept</button>
              <button className={styles["btn-decline"]}>Decline</button>
            </div>
          </div>
          <div className={styles["list-item"]}>
            <div className={styles["company-name"]}>Company name</div>
            <div>Name of the caller</div>
            <div>As a trainee</div>
            <div>13:40 pm</div>
            <div
              className={styles["list-actions"]}
              style={{ flex: 0.5, textAlign: "right" }}
            >
              <button className={styles["btn-accept"]}>Accept</button>
              <button className={styles["btn-decline"]}>Decline</button>
            </div>
          </div>
          <div className={styles["list-item"]}>
            <div className={styles["company-name"]}>Company name</div>
            <div>Name of the caller</div>
            <div>As a trainee</div>
            <div>13:40 pm</div>
            <div
              className={styles["list-actions"]}
              style={{ flex: 0.5, textAlign: "right" }}
            >
              <button className={styles["btn-accept"]}>Accept</button>
              <button className={styles["btn-decline"]}>Decline</button>
            </div>
          </div>
        </div>

        <div
          className={styles["content-section"]}
          style={{ paddingTop: "40px" }}
        >
          <div className={styles["section-header"]}>
            <h2>Recently Active Rooms</h2>
            <a href="#" className={styles["view-all"]}>
              View all
            </a>
          </div>
          <div className={styles["cards-grid"]}>
            <div className={styles.card}>
              <div className={styles["card-image"]}></div>
              <div className={styles["card-info"]}>
                <h3>Company Demo Name</h3>
                <p>👤 Role: Trainee</p>
                <p>📅 Joined at 12/12/2025</p>
              </div>
              <button className={styles["btn-enter"]}>Enter</button>
            </div>
            <div className={styles.card}>
              <div
                className={styles["card-image"]}
                style={{ backgroundColor: "#1a365d" }}
              ></div>
              <div className={styles["card-info"]}>
                <h3>Company Demo Name</h3>
                <p>👤 Role: Trainee</p>
                <p>📅 Joined at 12/12/2025</p>
              </div>
              <button className={styles["btn-enter"]}>Enter</button>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles["section-header"]}>
            <h2>Recently Active Owned Rooms</h2>
            <a href="#" className={styles["view-all"]}>
              View all
            </a>
          </div>
          <div className={styles["cards-grid"]}>
            <div className={styles.card}>
              <div className={styles["card-image"]}></div>
              <div className={styles["card-info"]}>
                <h3>Company Demo Name</h3>
                <p>👤 Role: Trainee</p>
                <p>📅 Joined at 12/12/2025</p>
              </div>
              <button className={styles["btn-enter"]}>Enter</button>
            </div>
            <div className={styles.card}>
              <div className={styles["card-image"]}></div>
              <div className={styles["card-info"]}>
                <h3>Company Demo Name</h3>
                <p>👤 Role: Trainee</p>
                <p>📅 Joined at 12/12/2025</p>
              </div>
              <button className={styles["btn-enter"]}>Enter</button>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles["section-header"]}>
            <h2>Recently Active Worked Rooms</h2>
            <a href="#" className={styles["view-all"]}>
              View all
            </a>
          </div>
          <div className={styles["cards-grid"]}>
            <div className={styles.card}>
              <div className={styles["card-image"]}></div>
              <div className={styles["card-info"]}>
                <h3>Company Demo Name</h3>
                <p>👤 Role: Trainee</p>
                <p>📅 Joined at 12/12/2025</p>
              </div>
              <button className={styles["btn-enter"]}>Enter</button>
            </div>
            <div className={styles.card}>
              <div className={styles["card-image"]}></div>
              <div className={styles["card-info"]}>
                <h3>Company Demo Name</h3>
                <p>👤 Role: Trainee</p>
                <p>📅 Joined at 12/12/2025</p>
              </div>
              <button className={styles["btn-enter"]}>Enter</button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
