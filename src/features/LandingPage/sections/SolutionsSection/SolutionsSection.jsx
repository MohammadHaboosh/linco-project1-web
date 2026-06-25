import { useScrollReveal } from "../../../../hooks/useScrollReveal";
import stylesLanding from "../../LandingPage.module.css";
import styles from "./SolutionsSection.module.css";

const TimelineItem = ({ number, title, desc, isReverse }) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`${styles.timelineRow} ${isReverse ? styles.timelineRowReverse : ""} reveal-up ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className={styles.timelineBox}>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <div className={styles.timelineEmpty}>
        <div className={styles.timelineBadge}>{number}</div>
      </div>
    </div>
  );
};

const SolutionsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className={styles.solutionsContainer} id="solutions">
      {/* SVG Wave Top */}
      <div
        style={{
          position: "absolute",
          top: "-1px",
          left: 0,
          width: "100%",
          overflow: "hidden",
          transform: "rotate(180deg)",
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            display: "block",
            width: "calc(100% + 1.3px)",
            height: "50px",
          }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,120.2,192,105.8,236.4,95.5,279.7,78.2,321.39,56.44Z"
            fill="#f8fafc"
          ></path>
        </svg>
      </div>

      <div
        ref={ref}
        className={`reveal-up ${isVisible ? "reveal-visible" : ""}`}
      >
        <h2 className={stylesLanding.sectionTitle}>Solutions</h2>
        <p
          className={stylesLanding.sectionSubtitle}
          style={{ color: "var(--color-linco-blue)", fontWeight: "600" }}
        >
          The Ultimate Solution for Fragmented Corporate Training Tools
        </p>
      </div>

      <div className={styles.timeline}>
        <TimelineItem
          number="1"
          title="Analytics Dashboards"
          desc="Comprehensive visual reports that give management clear insights into trainee progress, performance, and completion rates per department."
          isReverse={false}
        />
        <TimelineItem
          number="2"
          title="Shared Courses Library"
          desc="Add your own proprietary courses or purchase ready-made high-quality training content from other providers via our centralized marketplace."
          isReverse={true}
        />
        <TimelineItem
          number="3"
          title="Automated Certificates"
          desc="Instantly reward trainee efforts by automatically issuing professional completion certificates to their portfolio upon successful course completion."
          isReverse={false}
        />
        <TimelineItem
          number="4"
          title="Interactive Weekly Tasks"
          desc="Ensure continuous learning and engagement by assigning recurring challenges and professional tasks curated by department managers."
          isReverse={true}
        />
      </div>
    </section>
  );
};

export default SolutionsSection;
