import {
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoRefreshOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import styles from "./Quiz.module.css";

const QuizResult = ({ scoreInfo, onRetry, onContinue }) => {
  const { percentage, isPassed, correctCount, total } = scoreInfo;

  return (
    <div className={styles.resultContainer}>
      <div
        className={`${styles.resultIcon} ${isPassed ? styles.successIcon : styles.retryIcon}`}
      >
        {isPassed ? <IoTrophyOutline /> : <IoRefreshOutline />}
      </div>

      <span className={styles.quizBadge}>
        {isPassed ? "ASSESSMENT COMPLETE" : "KEEP PRACTICING"}
      </span>

      <h2>
        {isPassed ? "ممتاز! لقد اجتزت التقييم" : "أنت قريب جداً من النجاح"}
      </h2>
      <p>
        {isPassed
          ? "أداء رائع. يمكنك الآن الانتقال إلى الدرس التالي."
          : "راجع الدرس مرة أخرى وحاول من جديد للحصول على نتيجة أفضل."}
      </p>

      <div className={styles.resultBoard}>
        <div
          className={`${styles.scoreCircle} ${isPassed ? styles.circleSuccess : styles.circleDanger}`}
        >
          <strong>{percentage}%</strong>
          <span>النتيجة</span>
        </div>
        <div className={styles.resultStats}>
          <div>
            <IoCheckmarkCircleOutline />
            <span>إجابات صحيحة</span>
            <strong>{correctCount}</strong>
          </div>
          <div>
            <span className={styles.wrongDot} />
            <span>إجابات غير صحيحة</span>
            <strong>{total - correctCount}</strong>
          </div>
          <div>
            <span className={styles.passDot} />
            <span>حد النجاح</span>
            <strong>80%</strong>
          </div>
        </div>
      </div>

      <div className={styles.resultActions}>
        {!isPassed && (
          <button type="button" className={styles.retryBtn} onClick={onRetry}>
            <IoRefreshOutline />
            إعادة المحاولة
          </button>
        )}
        <button
          type="button"
          className={styles.continueBtn}
          onClick={onContinue}
        >
          متابعة الكورس
          <IoArrowBackOutline />
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
