import {
  IoFootstepsOutline,
  IoTimeOutline,
  IoBarChartOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import styles from "./Roadmaps.module.css";
import { useTranslation } from "react-i18next";

const RoadmapCard = ({ roadmap, onClick }) => {
  const { t } = useTranslation();

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return styles.levelBeginner;
      case "intermediate":
        return styles.levelIntermediate;
      case "advanced":
        return styles.levelAdvanced;
      default:
        return styles.levelBeginner;
    }
  };

  return (
    <div className={styles.roadmapCard} onClick={onClick}>
      <div className={styles.cardHeader}>
        <img
          src={roadmap.image}
          alt={roadmap.title}
          className={styles.coverImage}
        />
        <div className={styles.imageOverlay}></div>
        <div className={`${styles.levelBadge} ${getLevelColor(roadmap.level)}`}>
          <IoBarChartOutline /> {roadmap.level}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.tagsContainer}>
          {roadmap.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <h3 className={styles.title}>{roadmap.title}</h3>
        <p className={styles.description}>{roadmap.description}</p>

        <div className={styles.journeyMeta}>
          <div className={styles.metaItem}>
            <IoFootstepsOutline className={styles.metaIcon} />
            <span>
              <strong>{roadmap.milestonesCount}</strong> {t("milestones")}
            </span>
          </div>
          <div className={styles.metaDivider}></div>
          <div className={styles.metaItem}>
            <IoTimeOutline className={styles.metaIcon} />
            <span>
              {t("est")} <strong>{roadmap.duration}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.viewPathText}>{t("view-full-journey")}</span>
        <div className={styles.arrowCircle}>
          <IoArrowForwardOutline />
        </div>
      </div>
    </div>
  );
};

export default RoadmapCard;
