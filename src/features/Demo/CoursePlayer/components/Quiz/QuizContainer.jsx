import { useState } from "react";
import QuizTaker from "./QuizTaker";
import QuizResult from "./QuizResult";
import styles from "./Quiz.module.css";

const MOCK_QUIZ = {
  title: "Section 2 • Hooks & Architecture",
  description: "اختبر فهمك لأهم مفاهيم Hooks ودورة حياة المكونات.",
  timeLimit: 15,
  passingScore: 80,
  questions: [
    {
      id: 1,
      text: "ما الاستخدام الأساسي لـ useEffect داخل المكونات الوظيفية؟",
      options: [
        "إنشاء Route جديد",
        "التعامل مع الآثار الجانبية",
        "تغيير CSS مباشرة",
        "تعريف Props جديدة",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "ما أفضل وصف للـ Virtual DOM؟",
      options: [
        "نسخة خفيفة من واجهة المستخدم تساعد React على تحديث الـ UI بكفاءة",
        "قاعدة بيانات داخل المتصفح",
        "نظام لإدارة المستخدمين",
        "خادم لتشغيل Next.js",
      ],
      correctAnswer: 0,
    },
    {
      id: 3,
      text: "متى يكون Custom Hook مفيداً؟",
      options: [
        "عندما نريد مشاركة منطق React بين أكثر من مكون",
        "عندما نحتاج إلى تغيير اسم التطبيق",
        "فقط عند استخدام TypeScript",
        "فقط داخل ملفات CSS",
      ],
      correctAnswer: 0,
    },
  ],
};

const QuizContainer = ({ onCompleteSection = () => {} }) => {
  const [quizState, setQuizState] = useState("start");
  const [scoreInfo, setScoreInfo] = useState(null);

  const finishQuiz = (answers) => {
    const correctCount = MOCK_QUIZ.questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.correctAnswer ? 1 : 0),
      0,
    );

    const percentage = Math.round(
      (correctCount / MOCK_QUIZ.questions.length) * 100,
    );

    setScoreInfo({
      percentage,
      isPassed: percentage >= MOCK_QUIZ.passingScore,
      correctCount,
      total: MOCK_QUIZ.questions.length,
    });
    setQuizState("result");
  };

  const retryQuiz = () => setQuizState("taking");

  return (
    <div className={styles.quizWrapper} dir="rtl">
      {quizState === "start" && (
        <div className={styles.startScreen}>
          <div className={styles.quizBadge}>AI READY • ASSESSMENT</div>
          <div className={styles.startIcon}>✦</div>
          <h2>{MOCK_QUIZ.title}</h2>
          <p>{MOCK_QUIZ.description}</p>

          <div className={styles.quizStats}>
            <div>
              <strong>{MOCK_QUIZ.questions.length}</strong>
              <span>أسئلة</span>
            </div>
            <div>
              <strong>{MOCK_QUIZ.timeLimit}</strong>
              <span>دقائق</span>
            </div>
            <div>
              <strong>{MOCK_QUIZ.passingScore}%</strong>
              <span>حد النجاح</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.startBtn}
            onClick={() => setQuizState("taking")}
          >
            ابدأ التقييم
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
