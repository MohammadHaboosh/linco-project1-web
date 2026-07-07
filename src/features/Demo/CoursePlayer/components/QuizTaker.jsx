import { useState, useEffect } from "react";
import { IoTimeOutline, IoChevronForwardOutline } from "react-icons/io5";
import styles from "./Quiz.module.css";

const QuizTaker = ({ quiz, onSubmit }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // تحويل الدقائق لثواني

  // مؤقت تنازلي
  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(answers); // تسليم تلقائي عند انتهاء الوقت
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, answers, onSubmit]);

  // تنسيق الوقت (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelectOption = (optIndex) => {
    setAnswers({ ...answers, [currentQIndex]: optIndex });
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      onSubmit(answers);
    }
  };

  const currentQuestion = quiz.questions[currentQIndex];
  const progressPercent = ((currentQIndex + 1) / quiz.questions.length) * 100;
  const hasAnsweredCurrent = answers[currentQIndex] !== undefined;

  return (
    <div className={styles.takerContainer}>
      {/* الترويسة: المؤقت والتقدم */}
      <div className={styles.takerHeader}>
        <div className={styles.progressInfo}>
          <span>
            Question {currentQIndex + 1} of {quiz.questions.length}
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div
          className={`${styles.timerBox} ${timeLeft < 60 ? styles.timerWarning : ""}`}
        >
          <IoTimeOutline className={styles.timerIcon} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* منطقة السؤال */}
      <div className={styles.questionArea}>
        <h3 className={styles.questionText}>{currentQuestion.text}</h3>

        <div className={styles.optionsList}>
          {currentQuestion.options.map((opt, idx) => (
            <label
              key={idx}
              className={`${styles.optionCard} ${answers[currentQIndex] === idx ? styles.optionSelected : ""}`}
            >
              <input
                type="radio"
                name={`question_${currentQIndex}`}
                checked={answers[currentQIndex] === idx}
                onChange={() => handleSelectOption(idx)}
                className={styles.hiddenRadio}
              />
              <div className={styles.radioCustom}></div>
              <span className={styles.optionText}>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className={styles.takerFooter}>
        <button
          className={styles.nextBtn}
          onClick={handleNext}
          disabled={!hasAnsweredCurrent}
        >
          {currentQIndex === quiz.questions.length - 1
            ? "Submit Assessment"
            : "Next Question"}
          <IoChevronForwardOutline />
        </button>
      </div>
    </div>
  );
};

export default QuizTaker;
