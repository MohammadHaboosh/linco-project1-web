import { useState } from "react";
import QuizTaker from "./QuizTaker";
import QuizResult from "./QuizResult";
import styles from "./Quiz.module.css";
import { IoPlayOutline } from "react-icons/io5";

const MOCK_QUIZ = {
  title: "Section 2 • React Hooks",
  description: "اختبر فهمك لأهم مفاهيم React. هذا الاختبار يدعم خيارات متعددة.",
  timeLimit: 15,
  passingScore: 80,
  questions: [
    {
      id: 1,
      text: "أي من الحالات التالية نستخدم فيها useEffect؟ (اختر كل ما ينطبق)",
      options: [
        "جلب البيانات من خادم (API)",
        "تعريف متغيرات عادية داخل المكون",
        "الاشتراك في أحداث المتصفح (Event Listeners)",
        "تغيير لون زر مباشرة عبر CSS",
      ],
      correctAnswers: [0, 2],
    },
    {
      id: 2,
      text: "ما هو أفضل وصف للـ Virtual DOM؟",
      options: [
        "نسخة خفيفة من واجهة المستخدم تساعد React على تحديث الـ UI بكفاءة",
        "قاعدة بيانات داخل المتصفح",
        "نظام لإدارة المستخدمين",
        "خادم لتشغيل التطبيقات",
      ],
      correctAnswers: [0],
    },
    {
      id: 3,
      text: "متى يكون إنشاء Custom Hook مفيداً؟",
      options: [
        "عندما نريد مشاركة منطق (Logic) بين أكثر من مكون",
        "فقط عند استخدام TypeScript",
        "لتسهيل كتابة الكود المتكرر الخاص بالحالة (State)",
        "فقط داخل ملفات CSS",
      ],
      correctAnswers: [0, 2],
    },
  ],
};

const QuizContainer = ({ onCompleteSection = () => {} }) => {
  const [quizState, setQuizState] = useState("welcome");
  const [scoreInfo, setScoreInfo] = useState(null);

  const finishQuiz = (earnedScore, correctCount) => {
    const percentage = Math.round(
      (earnedScore / MOCK_QUIZ.questions.length) * 100,
    );
    setScoreInfo({
      percentage,
      isPassed: percentage >= MOCK_QUIZ.passingScore,
      correctCount,
      total: MOCK_QUIZ.questions.length,
    });
    setQuizState("result");
  };

  const retryQuiz = () => setQuizState("welcome");

  return (
    <div className={styles.quizWrapper} dir="rtl">
      {quizState === "welcome" && (
        <div className={styles.welcomeScreen}>
          <div className={styles.mascotEntrance}>
            <img
              src="/icons/linco-logo.png"
              alt="Mascot Greeting"
              className={styles.mascotImg}
            />
          </div>
          <div className={styles.welcomeContent}>
            <div className={styles.quizBadge}>تحدي الذكاء</div>
            <h2>{MOCK_QUIZ.title}</h2>
            <p>{MOCK_QUIZ.description}</p>

            <div className={styles.quizStatsOverview}>
              <div className={styles.statPill}>
                <strong>{MOCK_QUIZ.questions.length}</strong> أسئلة
              </div>
              <div className={styles.statPill}>
                <strong>{MOCK_QUIZ.timeLimit}</strong> دقيقة
              </div>
              <div className={styles.statPill}>
                نجاح <strong>{MOCK_QUIZ.passingScore}%</strong>
              </div>
            </div>

            <button
              type="button"
              className={styles.startBtn}
              onClick={() => setQuizState("taking")}
            >
              <IoPlayOutline /> ابدأ الاختبار الآن
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
