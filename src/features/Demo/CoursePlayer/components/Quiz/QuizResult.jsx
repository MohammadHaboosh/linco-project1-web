import {
  IoArrowBackOutline,
  IoRefreshOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import styles from "./Quiz.module.css";

const QuizResult = ({ scoreInfo, onRetry, onContinue }) => {
  const { percentage, isPassed, correctCount, total } = scoreInfo;

  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultContent}>
        <div className={styles.resultMascot}>
          <img
            src={isPassed ? "/images/squid-happy.png" : "/images/squid-sad.png"}
            alt={isPassed ? "Happy Mascot" : "Sad Mascot"}
            className={styles.mascotImgResult}
          />
        </div>

        <h2 className={isPassed ? styles.successText : styles.failText}>
          {isPassed
            ? "عمل رائع يا بطل! 🌟"
            : "لا بأس، يمكنك المحاولة مجدداً! 💪"}
        </h2>
        <p className={styles.resultSubtitle}>
          {isPassed
            ? "لقد أثبتت جدارتك في هذا القسم، أنت جاهز للتحدي القادم."
            : "راجع المواد التعليمية وجرب مرة أخرى لرفع علامتك."}
        </p>

        <div className={styles.scoreBoard}>
          <div className={styles.statsDetails}>
            <div className={styles.statRow}>
              <IoCheckmarkCircleOutline className={styles.correctIcon} />
              <span>إجابات صحيحة</span>
              <strong>
                {correctCount} / {total}
              </strong>
            </div>
            <div className={styles.statRow}>
              <div className={styles.targetDot} />
              <span>علامة النجاح المطلوبة</span>
              <strong>80%</strong>
            </div>
          </div>

          <div className={styles.dividerVertical} />

          <div
            className={`${styles.scoreRing} ${isPassed ? styles.ringSuccess : styles.ringFail}`}
          >
            <svg viewBox="0 0 36 36" className={styles.circularChart}>
              <path
                className={styles.circleBg}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={styles.circle}
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className={styles.scorePercentage}>
              <strong>{percentage}%</strong>
              <span>النتيجة</span>
            </div>
          </div>
        </div>

        <div className={styles.resultActions}>
          {!isPassed && (
            <button type="button" className={styles.retryBtn} onClick={onRetry}>
              <IoRefreshOutline /> إعادة الاختبار
            </button>
          )}
          <button
            type="button"
            className={styles.continueBtn}
            onClick={onContinue}
          >
            متابعة الكورس <IoArrowBackOutline />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
