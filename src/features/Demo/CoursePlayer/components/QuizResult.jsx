import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoRefreshOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import styles from "./Quiz.module.css";

const QuizResult = ({ scoreInfo, onRetry, onContinue }) => {
  const { percentage, isPassed, correctCount, total } = scoreInfo;

  return (
    <div className={styles.resultContainer}>
      {/* 💡 الحبار (Squid Mascot) */}
      <div className={styles.mascotWrapper}>
        <img
          src={isPassed ? "/images/squid-happy.png" : "/images/squid-sad.png"}
          alt={isPassed ? "Celebrating Squid" : "Sad Squid"}
          className={`${styles.mascotImage} ${isPassed ? styles.mascotBounce : styles.mascotShake}`}
          // ملاحظة: تأكد من إضافة صور الحبار في مجلد public/images
        />
      </div>

      {/* رسالة النتيجة */}
      <div className={styles.resultMessage}>
        <h2 className={isPassed ? styles.textSuccess : styles.textDanger}>
          {isPassed ? "Awesome Job!" : "Needs More Practice!"}
        </h2>
        <p>
          {isPassed
            ? "You have successfully passed the assessment. The next section is now unlocked."
            : "Don't worry, even the smartest squids make mistakes. Review the material and try again."}
        </p>
      </div>

      {/* الدائرة الإحصائية الفخمة */}
      <div className={styles.scoreBoard}>
        <div
          className={`${styles.scoreCircle} ${isPassed ? styles.circleSuccess : styles.circleDanger}`}
        >
          <span className={styles.scoreValue}>{percentage}%</span>
          <span className={styles.scoreLabel}>Score</span>
        </div>

        <div className={styles.scoreDetails}>
          <div className={styles.detailItem}>
            <IoCheckmarkCircle className={styles.iconSuccess} />
            <span>{correctCount} Correct</span>
          </div>
          <div className={styles.detailItem}>
            <IoCloseCircle className={styles.iconDanger} />
            <span>{total - correctCount} Incorrect</span>
          </div>
        </div>
      </div>

      {/* الإجراءات */}
      <div className={styles.resultActions}>
        {!isPassed ? (
          <button className={styles.retryBtn} onClick={onRetry}>
            <IoRefreshOutline /> Retry Assessment
          </button>
        ) : (
          <button className={styles.continueBtn} onClick={onContinue}>
            Continue Course <IoArrowForwardOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizResult;
