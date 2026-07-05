import { useState } from "react";
import { IoVideocamOutline, IoAddOutline } from "react-icons/io5";
// import { useDemo } from "../../../../../hooks/useDemo";
import LiveCard from "../LiveCard/LiveCard";
import styles from "./LivesContent.module.css";
import { useTranslation } from "react-i18next";

const MOCK_LIVES = [
  {
    id: 1,
    title: "React FSD Architecture Q&A",
    instructor: "Ahmad Sami",
    date: "2026-07-10T18:00:00",
    status: "LIVE", // حالة البث: LIVE, UPCOMING, RECORDED
    viewers: 145,
    thumbnail: "/images/linco-logo.jpg",
  },
  {
    id: 2,
    title: "Weekly Task Review & Solutions",
    instructor: "Sara Majed",
    date: "2026-07-15T20:00:00",
    status: "UPCOMING",
    viewers: 0,
    thumbnail: "/images/linco-logo.jpg",
  },
  {
    id: 3,
    title: "Introduction to Docker Containers",
    instructor: "Ahmad Sami",
    date: "2026-06-25T15:00:00",
    status: "RECORDED",
    viewers: 1024,
    thumbnail: "/images/linco-logo.jpg",
  },
];

const LivesContent = () => {
  const { t } = useTranslation();
  const //   {
    currentRoleView = "owner";
  // } = useDemo();
  const [activeTab, setActiveTab] = useState("UPCOMING");

  const canManage =
    currentRoleView === "owner" || currentRoleView === "sectionManager";

  const filteredLives = MOCK_LIVES.filter((live) => {
    if (activeTab === "UPCOMING")
      return live.status === "LIVE" || live.status === "UPCOMING";
    return live.status === "RECORDED";
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoVideocamOutline className={styles.headerIcon} />
          </div>
          <div>
            <span className={styles.subHeading}>
              {t("interactive-learning")}
            </span>
            <h1 className={styles.title}>{t("live-streams")}</h1>
            <p className={styles.description}>
              {t(
                "join-interactive-sessions-ask-questions-in-real-time-and-watch-past-recordings",
              )}
            </p>
          </div>
        </div>

        {canManage && (
          <button className={styles.createBtn}>
            <IoAddOutline className={styles.btnIcon} /> {t("schedule-live")}
          </button>
        )}
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === "UPCOMING" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("UPCOMING")}
        >
          {t("upcoming-and-live")}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "RECORDED" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("RECORDED")}
        >
          {t("recorded-sessions")}
        </button>
      </div>

      <div className={styles.livesGrid}>
        {filteredLives.length > 0 ? (
          filteredLives.map((live) => (
            <LiveCard key={live.id} live={live} canManage={canManage} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>{t("no-streams-available-in-this-category")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivesContent;
