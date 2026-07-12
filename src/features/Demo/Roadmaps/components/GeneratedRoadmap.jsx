import { useTranslation } from "react-i18next";
import {
  IoBarChartOutline,
  IoBookOutline,
  IoBriefcaseOutline,
  IoCheckmarkCircleOutline,
  IoConstructOutline,
  IoDocumentTextOutline,
  IoFlagOutline,
  IoLayersOutline,
  IoRocketOutline,
  IoTimeOutline,
} from "react-icons/io5";
import styles from "./Roadmaps.module.css";

const RoadmapList = ({ icon, title, items, accent = "blue" }) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className={`${styles.detailGroup} ${styles[accent]}`}>
      <div className={styles.detailTitle}>
        {icon}
        <h4>{title}</h4>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const GeneratedRoadmap = ({ roadmap }) => {
  const { t } = useTranslation();
  const steps = Array.isArray(roadmap.steps) ? roadmap.steps : [];
  const difficulty = String(roadmap.difficulty ?? "").toLowerCase();
  const difficultyClass = ["beginner", "intermediate", "advanced"].includes(
    difficulty,
  )
    ? styles[difficulty]
    : styles.intermediate;

  return (
    <section className={styles.resultSection} aria-live="polite">
      <div className={styles.resultHero}>
        <div className={styles.resultHeroContent}>
          <span className={styles.generatedLabel}>
            <IoCheckmarkCircleOutline />
            {t("ai-generated-roadmap", "AI-generated roadmap")}
          </span>
          <h2>{roadmap.title}</h2>
          <p>{roadmap.description}</p>

          <div className={styles.roadmapMeta}>
            <span>
              <IoTimeOutline />
              {roadmap.duration || t("duration-not-specified", "Flexible duration")}
            </span>
            <span className={difficultyClass}>
              <IoBarChartOutline />
              {roadmap.difficulty || t("difficulty-not-specified", "Adaptive")}
            </span>
            <span>
              <IoLayersOutline />
              {t("roadmap-step-count", {
                count: steps.length,
                defaultValue: "{{count}} learning steps",
              })}
            </span>
          </div>
        </div>
        <div className={styles.heroMark}>
          <IoRocketOutline />
        </div>
      </div>

      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewHeading}>
            <div className={styles.overviewIcon}>
              <IoBookOutline />
            </div>
            <div>
              <span>{t("before-you-start", "Before you start")}</span>
              <h3>{t("prerequisites", "Prerequisites")}</h3>
            </div>
          </div>
          <ul>
            {(roadmap.prerequisites ?? []).map((item, index) => (
              <li key={`${item}-${index}`}>
                <IoCheckmarkCircleOutline /> <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewHeading}>
            <div className={`${styles.overviewIcon} ${styles.outcomeIcon}`}>
              <IoBriefcaseOutline />
            </div>
            <div>
              <span>{t("where-this-leads", "Where this leads")}</span>
              <h3>{t("career-outcomes", "Career outcomes")}</h3>
            </div>
          </div>
          <div className={styles.outcomeTags}>
            {(roadmap.careerOutcomes ?? []).map((outcome, index) => (
              <span key={`${outcome}-${index}`}>{outcome}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.timelineHeader}>
        <span>{t("step-by-step-plan", "Step-by-step plan")}</span>
        <h3>{t("your-learning-journey", "Your learning journey")}</h3>
        <p>
          {t(
            "roadmap-timeline-description",
            "Follow each milestone in order and complete the practical deliverables before moving forward.",
          )}
        </p>
      </div>

      <div className={styles.timeline}>
        {steps.map((step, index) => (
          <article className={styles.stepRow} key={`${step.week}-${step.topic}`}>
            <div className={styles.timelineRail}>
              <div className={styles.weekMarker}>{step.week ?? index + 1}</div>
              {index < steps.length - 1 && <div className={styles.railLine} />}
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepHeader}>
                <div>
                  <span className={styles.weekLabel}>
                    {t("roadmap-week", {
                      week: step.week ?? index + 1,
                      defaultValue: "Week {{week}}",
                    })}
                  </span>
                  <h3>{step.topic}</h3>
                </div>
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {step.goal && (
                <div className={styles.goalBox}>
                  <IoFlagOutline />
                  <div>
                    <strong>{t("goal", "Goal")}</strong>
                    <p>{step.goal}</p>
                  </div>
                </div>
              )}

              <div className={styles.detailsGrid}>
                <RoadmapList
                  icon={<IoConstructOutline />}
                  title={t("skills", "Skills")}
                  items={step.skills}
                  accent="blue"
                />
                <RoadmapList
                  icon={<IoRocketOutline />}
                  title={t("projects", "Projects")}
                  items={step.projects}
                  accent="purple"
                />
                <RoadmapList
                  icon={<IoCheckmarkCircleOutline />}
                  title={t("deliverables", "Deliverables")}
                  items={step.deliverables}
                  accent="green"
                />
                <RoadmapList
                  icon={<IoDocumentTextOutline />}
                  title={t("resources", "Resources")}
                  items={step.resources}
                  accent="orange"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default GeneratedRoadmap;
