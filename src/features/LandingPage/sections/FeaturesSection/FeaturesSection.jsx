import { IoCheckmark } from "react-icons/io5";
import { useScrollReveal } from "../../../../hooks/useScrollReveal";
import { COLORS } from "../../../../theme/colors";
import styles from "../../LandingPage.module.css";
import placeholderImg from "/public/images/linco-logo.jpg";

const InfoRow = ({ title, desc, list, isReverse, btnText, imgSrc }) => {
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
  return (
    <section className={styles.section} id="features">
      <h2 className={styles.sectionTitle}>
        Transforming Professional Development
      </h2>
      <p className={styles.sectionSubtitle}>
        Discover how LinCo bridges the gap between learning and doing.
      </p>

      <InfoRow
        title="Comprehensive Content Management & Live Broadcasting"
        desc="Organize courses, stream live sessions, and track progress all from a single powerful dashboard designed for modern companies."
        list={[
          "High-quality video streaming",
          "Interactive Q&A sessions",
          "Detailed progress analytics",
        ]}
        isReverse={false}
        imgSrc="/images/features-landing/feature-1.png"
      />

      <InfoRow
        title="A Communications Hub That Breaks Down Silos"
        desc="Connect teams instantly. Share resources, discuss projects, and foster a collaborative environment seamlessly."
        list={[
          "Real-time messaging",
          "Project-specific channels",
          "File sharing and archiving",
        ]}
        btnText="Discover Hub"
        isReverse={true}
        imgSrc="/images/features-landing/feature-2.png"
      />

      <InfoRow
        title="Gamified Learning & Performance Analytics"
        desc="Motivate your trainees with leaderboards, experience points (XP), and comprehensive performance metrics."
        list={[
          "XP points & Leveling up",
          "Company Leaderboards",
          "Custom badges & achievements",
        ]}
        isReverse={false}
        imgSrc="/images/features-landing/feature-3.png"
      />

      <InfoRow
        title="Centralized Corporate Course Library"
        desc="Eliminate content fragmentation. Build your own proprietary training hub or enrich your team's knowledge with premium external content from other industry leaders."
        list={[
          "A dedicated marketplace allowing companies to securely host their own content.",
          "Advanced search and filtering capabilities.",
          "Seamlessly import purchased courses directly into specific department roadmaps.",
        ]}
        btnText="Browse The Library"
        isReverse={true}
        imgSrc="/images/features-landing/feature-4.png"
      />
    </section>
  );
};

export default FeaturesSection;
