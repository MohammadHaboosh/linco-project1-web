import {
  IoAddOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoListOutline,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";

const QuizzesTab = () => {
  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeaderFlex}>
        <div>
          <h3 className={styles.tabTitle}>Assessments & Quizzes</h3>
          <p className={styles.tabSubtitle}>
            Evaluate your trainees with custom quizzes.
          </p>
        </div>
        <button className={styles.primaryOutlineBtn}>
          <IoAddOutline /> Create Quiz
        </button>
      </div>

      <div className={styles.gridCards}>
        <div className={styles.quizCardItem}>
          <div className={styles.quizIconWrapper}>
            <IoShieldCheckmarkOutline />
          </div>
          <div className={styles.quizDetails}>
            <h4>Final Course Examination</h4>
            <div className={styles.quizMetrics}>
              <span>
                <IoTimeOutline /> 30 Mins
              </span>
              <span className={styles.dot}>•</span>
              <span>
                <IoListOutline /> 25 Questions
              </span>
            </div>
          </div>
          <button className={styles.editQuizBtn}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default QuizzesTab;
