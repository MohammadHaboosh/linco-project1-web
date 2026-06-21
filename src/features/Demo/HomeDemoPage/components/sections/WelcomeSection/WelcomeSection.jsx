import styles from "./WelcomeSection.module.css";

const WelcomeSection = ({ companyName, userName }) => {
  return (
    <div className={styles["welcome-text"]}>
      <div className={styles["welcome-badge"]}>
        <span>👋</span> Welcome Back
      </div>

      <h1>
        Welcome to{" "}
        <span className={styles["highlight-company"]}>{companyName}</span>
        <br />
        Academy, <span className={styles["highlight-name"]}>{userName}</span>!
      </h1>

      <p>
        Start your journey to top the company leaderboard and achieve your daily
        goals.
      </p>

      <div className={styles["welcome-actions"]}>
        <button className={styles["btn-primary"]}>Resume Learning</button>
        <button className={styles["btn-secondary"]}>View Road Map</button>
      </div>
    </div>
  );
};

export default WelcomeSection;
