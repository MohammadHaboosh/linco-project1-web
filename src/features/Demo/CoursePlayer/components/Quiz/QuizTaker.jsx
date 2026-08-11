import { useEffect, useState } from "react";
import {
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoArrowBackOutline,
  IoStarOutline,
} from "react-icons/io5";
import styles from "./Quiz.module.css";

const QuizTaker = ({ quiz, onSubmit }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);

  const currentQuestion = quiz.questions[currentQIndex];

  useEffect(() => {
    if (timeLeft <= 0 && !isChecking) {
      onSubmit(earnedPoints, earnedPoints);
      return;
    }
    const timer = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isChecking, earnedPoints, onSubmit]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)
      .toString()
      .padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;

  const toggleOption = (index) => {
    if (isChecking) return;
    setSelectedOptions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleCheckAnswer = () => {
    setIsChecking(true);
    const isCorrect =
      selectedOptions.length === currentQuestion.correctAnswers.length &&
      selectedOptions.every((val) =>
        currentQuestion.correctAnswers.includes(val),
      );

    if (isCorrect) {
      setEarnedPoints((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex((v) => v + 1);
      setSelectedOptions([]);
      setIsChecking(false);
    } else {
      onSubmit(earnedPoints, earnedPoints);
    }
  };

  const progress = ((currentQIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className={styles.takerContainer}>
      {/* ================= HEADER (الثابت) ================= */}
      <div className={styles.stickyHeader}>
        <div className={styles.topBarStats}>
          <div className={styles.scoreBox}>
            <IoStarOutline /> {earnedPoints} / {quiz.questions.length}
          </div>
          <div
            className={`${styles.timerBox} ${timeLeft < 60 ? styles.timerWarning : ""}`}
          >
            {formatTime(timeLeft)} <IoTimeOutline />
          </div>
        </div>

        <div className={styles.progressWrapper}>
          <span className={styles.progressText}>
            سؤال {currentQIndex + 1} من {quiz.questions.length}
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= QUESTION AREA (القابلة للتمرير الداخلي) ================= */}
      <div className={styles.scrollableQuestionArea}>
        <img
          src="/images/squid-thinking.png"
          alt="Thinking Mascot"
          className={styles.smallMascot}
        />

        <div className={styles.questionCard}>
          <h3>{currentQuestion.text}</h3>

          <div className={styles.optionsList}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOptions.includes(index);
              const isCorrectAnswer =
                currentQuestion.correctAnswers.includes(index);

              let optionClass = styles.optionCard;
              if (isChecking) {
                if (isCorrectAnswer) optionClass += ` ${styles.correctOption}`;
                else if (isSelected) optionClass += ` ${styles.wrongOption}`;
                else optionClass += ` ${styles.dimmedOption}`;
              } else if (isSelected) {
                optionClass += ` ${styles.selectedOption}`;
              }

              return (
                <button
                  type="button"
                  key={index}
                  className={optionClass}
                  onClick={() => toggleOption(index)}
                  disabled={isChecking}
                >
                  <div className={styles.checkbox}>
                    {isSelected && !isChecking && (
                      <div className={styles.checkboxFill} />
                    )}
                    {isChecking && isCorrectAnswer && (
                      <IoCheckmarkCircleOutline className={styles.resultIcon} />
                    )}
                    {isChecking && isSelected && !isCorrectAnswer && (
                      <IoCloseCircleOutline className={styles.resultIcon} />
                    )}
                  </div>
                  <span className={styles.optionText}>{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= FOOTER (الثابت) ================= */}
      <div className={styles.stickyFooter}>
        <span className={styles.hintText}>
          {currentQuestion.correctAnswers.length > 1
            ? "💡 يمكنك اختيار أكثر من إجابة"
            : "💡 اختر إجابة واحدة صحيحة"}
        </span>

        {!isChecking ? (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleCheckAnswer}
            disabled={selectedOptions.length === 0}
          >
            التحقق من الإجابة
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.nextBtn}`}
            onClick={nextQuestion}
          >
            {currentQIndex === quiz.questions.length - 1
              ? "إنهاء وإرسال"
              : "السؤال التالي"}
            <IoArrowBackOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTaker;
