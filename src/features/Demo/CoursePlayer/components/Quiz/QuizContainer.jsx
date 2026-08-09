import { useState } from "react";
import QuizTaker from "./QuizTaker";
import QuizResult from "./QuizResult";
import styles from "./Quiz.module.css";

// بيانات وهمية للاختبار (تأتي من الباك-إند لاحقاً)
const MOCK_QUIZ = {
  title: "Section 1 Final Assessment",
  timeLimit: 15, // بالدقائق
  passingScore: 80, // نسبة النجاح
  questions: [
    {
      id: 1,
      text: "What is the primary purpose of the Virtual DOM in React?",
      options: [
        "To directly manipulate HTML elements faster.",
        "To create a lightweight copy of the UI to optimize rendering performance.",
        "To manage global application state.",
        "To route between different pages securely.",
      ],
      correctAnswer: 1, // الإجابة الصحيحة هي الثانية (Index 1)
    },
    {
      id: 2,
      text: "Which hook is used to handle side effects in functional components?",
      options: ["useState", "useContext", "useEffect", "useReducer"],
      correctAnswer: 2,
    },
    {
      id: 3,
      text: "What does 'SSR' stand for in Next.js?",
      options: [
        "Server-Side Rendering",
        "Static Site Routing",
        "Single State React",
        "System Server Request",
      ],
      correctAnswer: 0,
    },
  ],
};

const QuizContainer = ({ onCompleteSection }) => {
  const [quizState, setQuizState] = useState("start"); // "start" | "taking" | "result"
  const [userAnswers, setUserAnswers] = useState({});
  const [scoreInfo, setScoreInfo] = useState(null);

  // بدء الامتحان
  const startQuiz = () => setQuizState("taking");

  // إنهاء الامتحان وحساب النتيجة
  const finishQuiz = (answers) => {
    let correctCount = 0;
    MOCK_QUIZ.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correctCount++;
    });

    const percentage = Math.round(
      (correctCount / MOCK_QUIZ.questions.length) * 100,
    );
    const isPassed = percentage >= MOCK_QUIZ.passingScore;

    setScoreInfo({
      percentage,
      isPassed,
      correctCount,
      total: MOCK_QUIZ.questions.length,
    });
    setQuizState("result");
  };

  // إعادة الامتحان
  const retryQuiz = () => {
    setUserAnswers({});
    setScoreInfo(null);
    setQuizState("taking");
  };

  return (
    <div className={styles.quizWrapper}>
      {quizState === "start" && (
        <div className={styles.startScreen}>
          <h2>{MOCK_QUIZ.title}</h2>
          <p>
            This assessment contains {MOCK_QUIZ.questions.length} questions. You
            need {MOCK_QUIZ.passingScore}% to pass.
          </p>
          <button className={styles.startBtn} onClick={startQuiz}>
            Start Assessment
          </button>
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
