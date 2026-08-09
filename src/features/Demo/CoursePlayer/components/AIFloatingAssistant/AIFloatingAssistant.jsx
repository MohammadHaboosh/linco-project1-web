import React, { useState } from "react";
import styles from "./AIFloatingAssistant.module.css";
import {
  IoSparklesOutline,
  IoChatbubbleEllipsesOutline,
  IoBulbOutline,
  IoCloseOutline,
  IoPaperPlaneOutline,
  IoCreateOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

const quickActions = [
  {
    id: "chat",
    icon: IoChatbubbleEllipsesOutline,
    title: "تحدث مع المساعد",
    description: "اسأل عن أي نقطة في الدرس الحالي",
  },
  {
    id: "quiz",
    icon: IoBulbOutline,
    title: "أنشئ كويز تجريبي",
    description: "أسئلة مخصصة حسب مستوى فهمك",
  },
  {
    id: "qa",
    icon: IoCreateOutline,
    title: "ولّد أسئلة وأجوبة",
    description: "مع الحل والتفسير خطوة بخطوة",
  },
];

const AIFloatingAssistant = () => {
  const [mode, setMode] = useState("home");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "مرحباً! أنا مساعدك الذكي. أستطيع شرح الدرس، توليد أسئلة، أو إعداد كويز قصير لك.",
    },
  ]);

  const openMode = (nextMode) => {
    setMode(nextMode);
    if (nextMode === "quiz") {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "تمام! سأجهز لك كويزاً قصيراً من 5 أسئلة حول الدرس الحالي.",
        },
      ]);
    }
  };

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      {
        role: "assistant",
        text: "فكرة ممتازة. هذه إجابة تجريبية — اربط هذا الجزء لاحقاً بخدمة الـ AI في الـ API لديك.",
      },
    ]);
    setMessage("");
  };

  return (
    <aside className={styles.aiRail} aria-live="polite">
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <IoSparklesOutline />
            </div>
            <div>
              <strong>Smart Assistant</strong>
              <span>
                <i /> جاهز لمساعدتك في هذا الدرس
              </span>
            </div>
          </div>
        </div>

        {mode === "home" && (
          <div className={styles.home}>
            <div className={styles.hero}>
              <div className={styles.heroGlow} />
              <IoSparklesOutline />
              <h3>ماذا تريد أن تفعل؟</h3>
              <p>اختر أداة سريعة أو ابدأ محادثة مع المساعد.</p>
            </div>

            <div className={styles.actionList}>
              {quickActions.map(({ id, icon: Icon, title, description }) => (
                <button
                  type="button"
                  className={styles.actionCard}
                  key={id}
                  onClick={() => openMode(id)}
                >
                  <span className={styles.actionIcon}>
                    <Icon />
                  </span>
                  <span className={styles.actionCopy}>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                  <span className={styles.actionArrow}>←</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={styles.startChat}
              onClick={() => setMode("chat")}
            >
              <IoChatbubbleEllipsesOutline />
              ابدأ محادثة
            </button>
          </div>
        )}

        {(mode === "chat" || mode === "quiz" || mode === "qa") && (
          <div className={styles.chatView}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setMode("home")}
            >
              ← العودة للأدوات
            </button>

            <div className={styles.modeHeading}>
              <div className={styles.modeIcon}>
                {mode === "quiz" ? (
                  <IoBulbOutline />
                ) : mode === "qa" ? (
                  <IoCreateOutline />
                ) : (
                  <IoChatbubbleEllipsesOutline />
                )}
              </div>
              <div>
                <strong>
                  {mode === "quiz"
                    ? "كويز تجريبي"
                    : mode === "qa"
                      ? "أسئلة وأجوبة"
                      : "محادثة مع AI"}
                </strong>
                <span>
                  {mode === "quiz"
                    ? "5 أسئلة • مستوى متوسط"
                    : "مبني على محتوى الدرس"}
                </span>
              </div>
            </div>

            <div className={styles.messages}>
              {messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={`${styles.message} ${item.role === "user" ? styles.userMessage : styles.aiMessage}`}
                >
                  {item.role === "assistant" && <IoSparklesOutline />}
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            {mode === "quiz" && (
              <div className={styles.generatedCard}>
                <div>
                  <IoCheckmarkCircleOutline /> Quiz جاهز
                </div>
                <span>5 أسئلة • اختيار من متعدد • مع شرح للإجابة</span>
                <button type="button">ابدأ الكويز</button>
              </div>
            )}

            {mode === "qa" && (
              <div className={styles.generatedCard}>
                <div>
                  <IoCheckmarkCircleOutline /> تم تجهيز المجموعة
                </div>
                <span>10 أسئلة وأجوبة مع الحل والتفسير</span>
                <button type="button">عرض الأسئلة</button>
              </div>
            )}

            <div className={styles.composer}>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder="اسأل عن هذا الدرس..."
                aria-label="اكتب رسالتك"
              />
              <button type="button" onClick={sendMessage} aria-label="إرسال">
                <IoPaperPlaneOutline />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AIFloatingAssistant;
