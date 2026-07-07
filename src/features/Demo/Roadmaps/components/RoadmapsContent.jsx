import { useState } from "react";
import { IoMapOutline, IoSearchOutline } from "react-icons/io5";
import RoadmapCard from "./RoadmapCard";
import styles from "./Roadmaps.module.css";
import { useTranslation } from "react-i18next";

const MOCK_ROADMAPS = [
  {
    id: "rm-1",
    title: "Front-End Master Developer",
    description:
      "A complete journey from HTML/CSS to advanced React architecture and performance optimization.",
    level: "Intermediate",
    duration: "6 Months",
    milestonesCount: 12,
    tags: ["React", "JavaScript", "Architecture"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: "rm-2",
    title: "UI/UX Professional Designer",
    description:
      "Learn to build user-centric designs, wireframes, and high-fidelity prototypes using Figma.",
    level: "Beginner",
    duration: "3 Months",
    milestonesCount: 8,
    tags: ["Figma", "Design", "Research"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: "rm-3",
    title: "Backend Scalability & Node.js",
    description:
      "Master databases, APIs, microservices, and Docker deployments for robust backends.",
    level: "Advanced",
    duration: "8 Months",
    milestonesCount: 15,
    tags: ["Node.js", "Docker", "Microservices"],
    image: "/images/linco-logo.jpg",
  },
];

const RoadmapsContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoadmaps = MOCK_ROADMAPS.filter((rm) =>
    rm.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenRoadmap = (id) => {
    console.log("Opening roadmap to fetch JSON for ID:", id);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerArea}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoMapOutline className={styles.headerIcon} />
            </div>
            <div>
              <span className={styles.subHeading}>{t("guided-journeys")}</span>
              <h1 className={styles.title}>{t("learning-roadmaps")}</h1>
              <p className={styles.description}>
                {t(
                  "follow-structured-step-by-step-paths-curated-by-experts-to-achieve-your-career-goals",
                )}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.controlsSection}>
          <div className={styles.searchBox}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search-for-a-career-path-or-skill")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.gridSection}>
          {filteredRoadmaps.length === 0 ? (
            <div className={styles.emptyState}>
              {t("no-roadmaps-found-matching-your-search")}
            </div>
          ) : (
            <div className={styles.roadmapsGrid}>
              {filteredRoadmaps.map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  onClick={() => handleOpenRoadmap(roadmap.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapsContent;
