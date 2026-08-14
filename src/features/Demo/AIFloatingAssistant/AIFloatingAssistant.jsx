import { useEffect, useRef, useState } from "react";
import {
  IoAlertCircleOutline,
  IoBulbOutline,
  IoChatbubblesOutline,
  IoCloseOutline,
  IoCreateOutline,
  IoRefreshOutline,
  IoSend,
  IoSparkles,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import TopicQuiz from "./components/TopicQuiz/TopicQuiz";
import { useCourseAssistant } from "./hooks/useCourseAssistant";
import styles from "./AIFloatingAssistant.module.css";

const quickActions = [
  {
    id: "chat",
    icon: IoChatbubblesOutline,
    titleKey: "ask-about-this-course",
    descriptionKey: "get-answers-grounded-in-the-course-content",
  },
  {
    id: "quiz",
    icon: IoBulbOutline,
    titleKey: "topic-specific-quiz",
    descriptionKey: "test-your-understanding-with-smart-questions",
  },
  {
    id: "randomQuiz",
    icon: IoCreateOutline,
    titleKey: "random-course-quiz",
    descriptionKey: "comprehensive-review-with-detailed-explanations",
  },
];

const suggestedQuestionKeys = [
  "what-are-the-main-ideas-in-this-course",
  "summarize-the-most-important-concepts",
  "what-should-i-review-before-moving-on",
];

const AIFloatingAssistant = ({ courseId }) => {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState("home");
  const [question, setQuestion] = useState("");
  const messagesEndRef = useRef(null);
  const isQuizMode = mode === "quiz" || mode === "randomQuiz";
  const {
    messages,
    isAsking,
    error,
    askQuestion,
    retryLastQuestion,
    dismissError,
  } = useCourseAssistant(courseId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAsking, error]);

  const sendQuestion = async (questionToSend = question) => {
    const normalizedQuestion = questionToSend.trim();
    if (!normalizedQuestion || isAsking) return;

    setQuestion("");
    await askQuestion(normalizedQuestion);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  };

  const renderConversation = () => (
    <>
      <div className={`${styles.messageWrapper} ${styles.aiMsg}`}>
        <div className={styles.aiAvatar} aria-hidden="true">
          <IoSparkles />
        </div>
        <div className={styles.messageBubble}>
          <p>{t("ask-me-anything-about-this-course")}</p>
        </div>
      </div>

      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.messageWrapper} ${
            message.role === "user" ? styles.userMsg : styles.aiMsg
          }`}
        >
          {message.role === "assistant" && (
            <div className={styles.aiAvatar} aria-hidden="true">
              <IoSparkles />
            </div>
          )}
          <div className={styles.messageBubble}>
            <p>{message.text}</p>
          </div>
        </div>
      ))}

      {mode === "chat" && messages.length === 0 && (
        <div className={styles.suggestions}>
          <span>{t("try-asking")}</span>
          {suggestedQuestionKeys.map((suggestionKey) => (
            <button
              type="button"
              key={suggestionKey}
              onClick={() => sendQuestion(t(suggestionKey))}
              disabled={isAsking}
            >
              {t(suggestionKey)}
            </button>
          ))}
        </div>
      )}

      {isAsking && (
        <div className={`${styles.messageWrapper} ${styles.aiMsg}`}>
          <div className={styles.aiAvatar} aria-hidden="true">
            <IoSparkles />
          </div>
          <div className={`${styles.messageBubble} ${styles.thinkingBubble}`}>
            <span />
            <span />
            <span />
            <span className={styles.srOnly}>{t("finding-an-answer")}</span>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorNotice} role="alert">
          <IoAlertCircleOutline aria-hidden="true" />
          <div>
            <strong>{t("we-couldnt-get-an-answer")}</strong>
            <span>{error}</span>
            <button
              type="button"
              onClick={retryLastQuestion}
              disabled={isAsking}
            >
              <IoRefreshOutline /> {t("try-again")}
            </button>
          </div>
          <button
            type="button"
            className={styles.dismissErrorBtn}
            onClick={dismissError}
            aria-label={t("dismiss-error")}
          >
            <IoCloseOutline />
          </button>
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  );

  return (
    <div className={styles.aiContainer}>
      {mode === "home" ? (
        <div className={styles.homeView}>
          <div className={styles.heroSection}>
            <div className={styles.glowBg} />
            <div className={styles.iconCircle}>
              <IoSparkles />
            </div>
            <span className={styles.heroEyebrow}>
              {t("course-aware-assistant")}
            </span>
            <h3>{t("how-can-i-help-you")}</h3>
            <p>{t("ask-a-question-and-get-an-answer-based-on-this-course")}</p>
          </div>

          <div className={styles.actionsGrid}>
            {quickActions.map(
              ({ id, icon: Icon, titleKey, descriptionKey }) => (
                <button
                  type="button"
                  key={id}
                  className={styles.actionCard}
                  onClick={() => setMode(id)}
                >
                  <div className={styles.actionIcon}>
                    <Icon />
                  </div>
                  <div className={styles.actionText}>
                    <strong>{t(titleKey)}</strong>
                    <span>{t(descriptionKey)}</span>
                  </div>
                </button>
              ),
            )}
          </div>
        </div>
      ) : (
        <div className={styles.chatView}>
          <div className={styles.chatHeader}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => setMode("home")}
            >
              <span aria-hidden="true">
                {i18n.dir() === "rtl" ? "→" : "←"}
              </span>{" "}
              {t("back")}
            </button>
            <div className={styles.chatModeInfo}>
              <IoSparkles className={styles.chatModeIcon} />
              <div>
                <strong>
                  {mode === "quiz"
                    ? t("interactive-quiz")
                    : mode === "randomQuiz"
                      ? t("random-course-quiz")
                      : t("course-assistant")}
                </strong>
                <span>
                  {isQuizMode
                    ? t("quiz-generated-from-course-content")
                    : t("answers-from-course-content")}
                </span>
              </div>
            </div>
          </div>

          <div
            className={styles.messagesArea}
            aria-live="polite"
            aria-busy={!isQuizMode && isAsking}
          >
            {isQuizMode ? (
              <TopicQuiz
                key={mode}
                courseId={courseId}
                quizType={mode === "randomQuiz" ? "random" : "topic"}
              />
            ) : (
              renderConversation()
            )}
          </div>

          {!isQuizMode && (
            <>
              <div className={styles.inputArea}>
                <textarea
                  rows="1"
                  maxLength="1000"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("ask-anything-about-this-course-placeholder")}
                  className={styles.chatInput}
                  disabled={isAsking || !courseId}
                  aria-label={t("question-for-the-course-assistant")}
                />
                <button
                  type="button"
                  className={styles.sendBtn}
                  onClick={() => sendQuestion()}
                  disabled={!question.trim() || isAsking || !courseId}
                  aria-label={t("send-question")}
                >
                  <IoSend />
                </button>
              </div>
              <p className={styles.composerHint}>
                {t("press-enter-to-send-shift-enter-for-a-new-line")}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIFloatingAssistant;
