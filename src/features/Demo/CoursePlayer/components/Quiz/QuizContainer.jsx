import { useState } from "react";
import QuizTaker from "./QuizTaker";
import QuizResult from "./QuizResult";
import styles from "./Quiz.module.css";
import {
  IoPlayOutline,
  IoTimeOutline,
  IoListOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

const MOCK_QUIZ = {
  title: "Section 2 • React Hooks",
  description:
    "Test your understanding of core React concepts. This quiz supports multiple correct choices.",
  timeLimit: 15,
  passingScore: 80,
  questions: [
    {
      id: 1,
      text: "Which of the following are valid use cases for useEffect? (Select all that apply)",
      options: [
        "Fetching data from an API",
        "Defining standard local variables",
        "Subscribing to browser events",
        "Changing CSS colors directly",
      ],
      correctAnswers: [0, 2],
    },
    {
      id: 2,
      text: "What is the best description of the Virtual DOM?",
      options: [
        "A lightweight copy of the UI to optimize rendering",
        "A database inside the browser",
        "A user management system",
        "A server to run Next.js apps",
      ],
      correctAnswers: [0],
    },
    {
      id: 3,
      text: "When is creating a Custom Hook useful?",
      options: [
        "To share stateful logic between components",
        "Only when using TypeScript",
        "To easily reuse repetitive logic",
        "Only inside CSS modules",
      ],
      correctAnswers: [0, 2],
    },
  ],
};

const QuizContainer = ({ onCompleteSection = () => {} }) => {
  const [quizState, setQuizState] = useState("welcome");
  const [scoreInfo, setScoreInfo] = useState(null);

  const finishQuiz = (earnedScore) => {
    const percentage = Math.round(
      (earnedScore / MOCK_QUIZ.questions.length) * 100,
    );
    setScoreInfo({
      percentage,
      isPassed: percentage >= MOCK_QUIZ.passingScore,
      correctCount: earnedScore,
      total: MOCK_QUIZ.questions.length,
    });
    setQuizState("result");
  };

  const retryQuiz = () => setQuizState("welcome");

  return (
    <div className={styles.quizWrapper} dir="ltr">
      {quizState === "welcome" && (
        <div className={styles.welcomeScreen}>
          <div className={styles.mascotEntrance}>
            <img
              src="/images/squid-greeting.png"
              alt="Mascot Greeting"
              className={styles.mascotImg}
            />
          </div>

          <div className={styles.welcomeContent}>
            <div className={styles.quizBadge}>INTELLIGENCE CHALLENGE</div>
            <h2>{MOCK_QUIZ.title}</h2>
            <p>{MOCK_QUIZ.description}</p>

            <div className={styles.quizStatsOverview}>
              <div className={styles.statPill}>
                <IoListOutline /> <strong>{MOCK_QUIZ.questions.length}</strong>{" "}
                Questions
              </div>
              <div className={styles.statPill}>
                <IoTimeOutline /> <strong>{MOCK_QUIZ.timeLimit}</strong> Minutes
              </div>
              <div className={styles.statPill}>
                <IoCheckmarkCircleOutline />{" "}
                <strong>{MOCK_QUIZ.passingScore}%</strong> Passing Score
              </div>
            </div>

            <button
              type="button"
              className={styles.startBtn}
              onClick={() => setQuizState("taking")}
            >
              <IoPlayOutline /> Start Quiz Now
            </button>
          </div>
        </div>
      )}

      {quizState === "taking" && (
        <QuizTaker quiz={MOCK_QUIZ} onSubmit={finishQuiz} />
      )}

      {quizState === "result" && (
        <QuizResult
          scoreInfo={scoreInfo}
          onRetry={retryQuiz}
          onContinue={onCompleteSection}
        />
      )}
    </div>
  );
};

export default QuizContainer;
