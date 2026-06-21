import { IoChevronBack, IoFlashOutline, IoPulseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import styles from "./PathHeaderSection.module.css";
import { PATHS } from "../../../../../../routes/paths";

const PathHeaderSection = () => {
  return (
    <div className={styles.headerSection}>
      <Link to={PATHS.DEPARTMENTS} className={styles.backLink}>
        <IoChevronBack style={{ marginRight: "5px" }} /> Back-End Department
      </Link>
      <h1 className={styles.title}>Trainee Learning Path</h1>

      <div className={styles.topPanels}>
        {/* القسم الأيسر: النصوص الحرة النظيفة */}
        <div className={styles.welcomePanel}>
          <div className={styles.badge}>
            <span>👋</span> Welcome Back
          </div>
          <h3>
            Ready to dive into your
            <br />
            learning, <span className={styles.nameHighlight}>Abrar!</span>
          </h3>
          <p>
            Manage your company links, track your active training rooms, and
            level up your career from one single dashboard.
          </p>
        </div>

        {/* القسم الأيمن: صندوق إحصائيات بأسلوب الـ Leaderboard */}
        <div className={styles.statsCard}>
          <h3 className={styles.statsTitle}>Progress Summary</h3>
          <div className={styles.statList}>
            {/* الصف الأول (مظلل/نشط) */}
            <div className={`${styles.statRow} ${styles.statRowActive}`}>
              <div className={styles.statRowLeft}>
                <div className={styles.statIcon}>
                  {/* <IoTargetOutline /> */}
                </div>
                <span className={styles.statLabel}>Course Completion</span>
              </div>
              <div className={styles.statRowRight}>25%</div>
            </div>

            {/* الصف الثاني */}
            <div className={styles.statRow}>
              <div className={styles.statRowLeft}>
                <div className={styles.statIcon}>
                  <IoFlashOutline />
                </div>
                <span className={styles.statLabel}>XP Points</span>
              </div>
              <div className={styles.statRowRight}>1,200 XP</div>
            </div>

            {/* الصف الثالث */}
            <div className={styles.statRow}>
              <div className={styles.statRowLeft}>
                <div className={styles.statIcon}>
                  <IoPulseOutline />
                </div>
                <span className={styles.statLabel}>Day Strike</span>
              </div>
              <div className={styles.statRowRight}>3 Days</div>
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />
    </div>
  );
};

export default PathHeaderSection;
