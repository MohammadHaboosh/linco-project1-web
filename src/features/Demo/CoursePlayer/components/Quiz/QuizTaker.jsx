import { useEffect, useMemo, useState } from "react";
import {
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import styles from "./Quiz.module.css";

const QuizTaker = ({ quiz, onSubmit }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const currentQuestion = quiz.questions[currentQIndex];

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(answers);
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answers, onSubmit]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = ((currentQIndex + 1) / quiz.questions.length) * 100;

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const selectOption = (index) => {
    setAnswers((current) => ({ ...current, [currentQIndex]: index }));
  };

  const next = () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex((value) => value + 1);
    } else {
      onSubmit(answers);
    }
  };

  return (
    <div className={styles.takerContainer}>
      <div className={styles.takerHeader}>
        <div>
          <span className={styles.quizEyebrow}>ASSESSMENT • {quiz.title}</span>
          <h2>اختبر فهمك</h2>
        </div>
        <div
          className={`${styles.timerBox} ${timeLeft < 60 ? styles.timerWarning : ""}`}
        >
          <IoTimeOutline />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className={styles.questionProgress}>
        <div>
          <span>
            السؤال {currentQIndex + 1} من {quiz.questions.length}
          </span>
          <strong>{answeredCount} مجاب</strong>
        </div>
        <div className={styles.progressBar}>
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.questionArea}>
        <span className={styles.questionNumber}>
          QUESTION {String(currentQIndex + 1).padStart(2, "0")}
        </span>
        <h3>{currentQuestion.text}</h3>

        <div className={styles.optionsList}>
          {currentQuestion.options.map((option, index) => {
            const selected = answers[currentQIndex] === index;
            return (
              <button
                type="button"
                key={option}
                className={`${styles.optionCard} ${selected ? styles.optionSelected : ""}`}
                onClick={() => selectOption(index)}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={styles.optionText}>{option}</span>
                {selected && (
                  <IoCheckmarkCircleOutline className={styles.selectedIcon} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.takerFooter}>
        <span>اختر إجابة واحدة للمتابعة</span>
        <button
          type="button"
          className={styles.nextBtn}
          onClick={next}
          disabled={answers[currentQIndex] === undefined}
        >
          {currentQIndex === quiz.questions.length - 1
            ? "إنهاء التقييم"
            : "السؤال التالي"}
          <IoArrowBackOutline />
        </button>
      </div>
    </div>
  );
};

export default QuizTaker;
