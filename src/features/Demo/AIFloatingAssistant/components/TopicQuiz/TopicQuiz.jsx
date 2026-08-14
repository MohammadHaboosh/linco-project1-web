import { useState } from "react";
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoBulbOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoRefreshOutline,
  IoShuffleOutline,
  IoSparkles,
  IoTrophyOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useGeneratedQuiz } from "../../hooks/useGeneratedQuiz";
import styles from "./TopicQuiz.module.css";

const getOptionLabel = (index) => String.fromCharCode(65 + index);

const getOptionText = (option) =>
  String(option ?? "")
    .replace(/^\s*[A-Z]\s*[).:-]\s*/i, "")
    .trim();

const TopicQuiz = ({ courseId, quizType = "topic" }) => {
  const { t, i18n } = useTranslation();
  const isRandomQuiz = quizType === "random";
  const isRtl = i18n.dir() === "rtl";
  const PreviousIcon = isRtl
    ? IoArrowForwardOutline
    : IoArrowBackOutline;
  const NextIcon = isRtl ? IoArrowBackOutline : IoArrowForwardOutline;
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const { questions, isGenerating, error, generateQuiz, resetQuiz } =
    useGeneratedQuiz(courseId, quizType);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionIndex = answers[currentQuestionIndex];
  const hasAnswered = Number.isInteger(selectedOptionIndex);

  const handleGenerate = async (event) => {
    event.preventDefault();

    const generatedQuestions = await generateQuiz({
      topic,
      questionCount: Number(questionCount),
    });
    if (!generatedQuestions) return;

    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsComplete(false);
  };

  const handleSelectOption = (optionIndex) => {
    if (hasAnswered) return;

    setAnswers((current) => ({
      ...current,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((current) => current + 1);
      return;
    }

    setIsComplete(true);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((current) => current - 1);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsComplete(false);
  };

  const handleNewQuiz = () => {
    resetQuiz();
    setTopic("");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsComplete(false);
  };

  const correctAnswerCount = questions.reduce(
    (total, question, index) =>
      total + (answers[index] === question.correctOptionIndex ? 1 : 0),
    0,
  );

  if (questions.length === 0) {
    return (
      <div className={styles.setupView}>
        <div className={styles.setupHero}>
          <div className={styles.setupIcon}>
            {isRandomQuiz ? <IoShuffleOutline /> : <IoBulbOutline />}
          </div>
          <span>
            {isRandomQuiz
              ? t("build-a-random-course-quiz")
              : t("build-a-topic-quiz")}
          </span>
          <h3>
            {isRandomQuiz
              ? t("ready-for-a-course-wide-challenge")
              : t("what-would-you-like-to-practice")}
          </h3>
          <p>
            {isRandomQuiz
              ? t("choose-how-many-random-questions-to-request")
              : t("choose-a-course-topic-and-question-count")}
          </p>
        </div>

        <form className={styles.setupForm} onSubmit={handleGenerate}>
          {!isRandomQuiz && (
            <label className={styles.fieldGroup}>
              <span>{t("quiz-topic")}</span>
              <input
                type="text"
                value={topic}
                maxLength="120"
                onChange={(event) => setTopic(event.target.value)}
                placeholder={t("quiz-topic-placeholder")}
                disabled={isGenerating}
                required
              />
            </label>
          )}

          <label className={styles.fieldGroup}>
            <span>{t("requested-question-count")}</span>
            <input
              type="number"
              min="1"
              step="1"
              value={questionCount}
              onChange={(event) => setQuestionCount(event.target.value)}
              disabled={isGenerating}
              required
            />
          </label>

          <p className={styles.formNote}>
            <IoSparkles /> {t("quiz-question-count-may-vary")}
          </p>

          {error && (
            <div className={styles.generateError} role="alert">
              <IoCloseCircle />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.generateButton}
            disabled={
              isGenerating ||
              (!isRandomQuiz && !topic.trim()) ||
              !questionCount
            }
          >
            {isGenerating ? (
              <>
                <span className={styles.buttonSpinner} />
                {t("generating-your-quiz")}
              </>
            ) : (
              <>
                <IoSparkles />
                {isRandomQuiz
                  ? t("generate-random-quiz")
                  : t("generate-topic-quiz")}
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round(
      (correctAnswerCount / questions.length) * 100,
    );

    return (
      <div className={styles.completionView}>
        <div className={styles.trophyIcon}>
          <IoTrophyOutline />
        </div>
        <span className={styles.completionEyebrow}>{t("quiz-complete")}</span>
        <h3>{t("generated-quiz-score", { score: percentage })}</h3>
        <p>
          {t("generated-quiz-result-summary", {
            correct: correctAnswerCount,
            total: questions.length,
          })}
        </p>

        <div className={styles.resultActions}>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={handleRetake}
          >
            <IoRefreshOutline /> {t("retake-quiz")}
          </button>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={handleNewQuiz}
          >
            {t("create-another-quiz")}
          </button>
        </div>
      </div>
    );
  }

  const isCorrect =
    selectedOptionIndex === currentQuestion.correctOptionIndex;
  const correctOption =
    currentQuestion.options[currentQuestion.correctOptionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className={styles.quizPlayer}>
      <div className={styles.quizMeta}>
        <div>
          <span className={styles.topicLabel}>
            {isRandomQuiz ? t("quiz-scope") : t("quiz-topic")}
          </span>
          <strong>{isRandomQuiz ? t("entire-course") : topic}</strong>
        </div>
        <span className={styles.questionCounter}>
          {t("question-progress", {
            current: currentQuestionIndex + 1,
            total: questions.length,
          })}
        </span>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className={styles.questionCard}>
        <h3>{currentQuestion.question}</h3>
        <p className={styles.questionHint}>
          {t("choose-one-answer-for-immediate-feedback")}
        </p>

        <div className={styles.optionsList}>
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = optionIndex === selectedOptionIndex;
            const isCorrectOption =
              optionIndex === currentQuestion.correctOptionIndex;
            const showCorrect = hasAnswered && isCorrectOption;
            const showWrong = hasAnswered && isSelected && !isCorrectOption;

            return (
              <button
                type="button"
                key={`${currentQuestion.id}-option-${optionIndex}`}
                className={`${styles.optionButton} ${
                  showCorrect ? styles.correctOption : ""
                } ${showWrong ? styles.wrongOption : ""} ${
                  hasAnswered && !showCorrect && !showWrong
                    ? styles.dimmedOption
                    : ""
                }`}
                onClick={() => handleSelectOption(optionIndex)}
                disabled={hasAnswered}
              >
                <span className={styles.optionLabel}>
                  {getOptionLabel(optionIndex)}
                </span>
                <span className={styles.optionText}>{getOptionText(option)}</span>
                {showCorrect && <IoCheckmarkCircle />}
                {showWrong && <IoCloseCircle />}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div
            className={`${styles.feedbackCard} ${
              isCorrect ? styles.correctFeedback : styles.wrongFeedback
            }`}
            aria-live="polite"
          >
            <div className={styles.feedbackTitle}>
              {isCorrect ? <IoCheckmarkCircle /> : <IoCloseCircle />}
              <strong>{isCorrect ? t("correct") : t("not-quite")}</strong>
            </div>
            <p className={styles.correctAnswerText}>
              <span>{t("correct-answer")}:</span>{" "}
              {getOptionLabel(currentQuestion.correctOptionIndex)}){" "}
              {getOptionText(correctOption)}
            </p>
            {currentQuestion.explanation && (
              <p className={styles.explanation}>
                <IoBulbOutline />
                <span>{currentQuestion.explanation}</span>
              </p>
            )}
          </div>
        )}
      </section>

      <div className={styles.quizNavigation}>
        <button
          type="button"
          className={styles.previousButton}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <PreviousIcon /> {t("previous")}
        </button>
        <button
          type="button"
          className={styles.nextButton}
          onClick={handleNext}
          disabled={!hasAnswered}
        >
          {currentQuestionIndex === questions.length - 1
            ? t("view-results")
            : t("next-question")}
          <NextIcon />
        </button>
      </div>
    </div>
  );
};

export default TopicQuiz;
