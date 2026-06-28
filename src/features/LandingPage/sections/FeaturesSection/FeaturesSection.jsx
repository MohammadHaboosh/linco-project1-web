import { IoCheckmark } from "react-icons/io5";
import { useScrollReveal } from "../../../../hooks/useScrollReveal";
import styles from "../../LandingPage.module.css";
import { useTranslation } from "react-i18next";

const InfoRow = ({ title, desc, list, isReverse, btnText, imgSrc }) => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${styles.infoRow} ${isReverse ? styles.infoRowReverse : ""} reveal-up ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className={styles.infoImage}>
        <img src={imgSrc} alt={title} className={styles.featureImg} />
      </div>
      <div className={styles.infoText}>
        <h3>{title}</h3>
        {desc && <p>{desc}</p>}
        <ul className={styles.checkList}>
          {list.map((item, i) => (
            <li key={i}>
              <IoCheckmark className={styles.checkIcon} />{" "}
              <span style={{ flex: 1 }}>{item}</span>
            </li>
          ))}
        </ul>
        {btnText && <button className={styles.btnSecondary}>{btnText}</button>}
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section} id="features">
      <h2 className={styles.sectionTitle}>
        {t("transforming-professional-development")}
      </h2>
      <p className={styles.sectionSubtitle}>
        {t("discover-how-linco-bridges-the-gap-between-learning-and-doing")}
      </p>

      <InfoRow
        title={t("comprehensive-content-management-and-live-broadcasting")}
        desc={t(
          "organize-courses-stream-live-sessions-and-track-progress-all-from-a-single-powerful-dashboard-designed-for-modern-companies",
        )}
        list={[
          t("high-quality-video-streaming-0"),
          t("interactive-q-and-a-sessions"),
          t("detailed-progress-analytics"),
        ]}
        isReverse={false}
        imgSrc="/images/features-landing/feature-1.png"
      />

      <InfoRow
        title={t("t-a-communications-hub-that-breaks-down-silos")}
        desc={t(
          "connect-teams-instantly-share-resources-discuss-projects-and-foster-a-collaborative-environment-seamlessly",
        )}
        list={[
          t("real-time-messaging"),
          t("project-specific-channels"),
          t("file-sharing-and-archiving"),
        ]}
        btnText={t("discover-hub")}
        isReverse={true}
        imgSrc="/images/features-landing/feature-2.png"
      />

      <InfoRow
        title={t("gamified-learning-and-performance-analytics")}
        desc={t(
          "motivate-your-trainees-with-leaderboards-experience-points-xp-and-comprehensive-performance-metrics",
        )}
        list={[
          t("xp-points-and-leveling-up"),
          t("company-leaderboards"),
          t("custom-badges-and-achievements"),
        ]}
        isReverse={false}
        imgSrc="/images/features-landing/feature-3.png"
      />

      <InfoRow
        title={t("centralized-corporate-course-library")}
        desc={t(
          "eliminate-content-fragmentation-build-your-own-proprietary-training-hub-or-enrich-your-teams-knowledge-with-premium-external-content-from-other-industry-leaders",
        )}
        list={[
          t(
            "a-dedicated-marketplace-allowing-companies-to-securely-host-their-own-content",
          ),
          t("advanced-search-and-filtering-capabilities"),
          t(
            "seamlessly-import-purchased-courses-directly-into-specific-department-roadmaps",
          ),
          t("browse-the-library"),
        ]}
        btnText={t("browse-the-library-0")}
        isReverse={true}
        imgSrc="/images/features-landing/feature-4.png"
      />
    </section>
  );
};

export default FeaturesSection;
