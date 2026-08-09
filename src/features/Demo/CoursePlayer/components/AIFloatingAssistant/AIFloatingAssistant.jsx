import React, { useState } from "react";
import styles from "./AIFloatingAssistant.module.css";
import {
  IoSparkles,
  IoChatbubblesOutline,
  IoBulbOutline,
  IoSend,
  IoCreateOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";

const quickActions = [
  {
    id: "chat",
    icon: IoChatbubblesOutline,
    title: "تحدث مع المساعد",
    description: "اسأل عن أي نقطة غير مفهومة في الدرس",
  },
  {
    id: "quiz",
    icon: IoBulbOutline,
    title: "كويز تفاعلي سريع",
    description: "أسئلة ذكية لاختبار استيعابك للمعلومات",
  },
  {
    id: "qa",
    icon: IoCreateOutline,
    title: "توليد أسئلة وأجوبة",
    description: "مراجعة شاملة للدرس مع التفسير",
  },
];

const AIFloatingAssistant = () => {
  const [mode, setMode] = useState("home");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "مرحباً بك! أنا مساعدك الذكي 🤖. كيف يمكنني مساعدتك في هذا الكورس اليوم؟",
    },
  ]);

  const openMode = (nextMode) => {
    setMode(nextMode);
    if (nextMode === "quiz") {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "ممتاز! أقوم الآن بتجهيز 5 أسئلة ذكية بناءً على محتوى الدرس الحالي. هل أنت مستعد؟",
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
        text: "سؤال رائع! (هذا رد تجريبي - سيتم ربطه بالذكاء الاصطناعي لاحقاً).",
      },
    ]);
    setMessage("");
  };

  return (
    <div className={styles.aiContainer}>
      {mode === "home" ? (
        <div className={styles.homeView}>
          <div className={styles.heroSection}>
            <div className={styles.glowBg}></div>
            <div className={styles.iconCircle}>
              <IoSparkles />
            </div>
            <h3>كيف أساعدك اليوم؟</h3>
            <p>اختر إجراءً سريعاً أو ابدأ الدردشة معي مباشرة.</p>
          </div>

          <div className={styles.actionsGrid}>
            {quickActions.map(({ id, icon: Icon, title, description }) => (
              <button
                key={id}
                className={styles.actionCard}
                onClick={() => openMode(id)}
              >
                <div className={styles.actionIcon}>
                  <Icon />
                </div>
                <div className={styles.actionText}>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.chatView}>
          <div className={styles.chatHeader}>
            <button className={styles.backBtn} onClick={() => setMode("home")}>
              العودة
            </button>
            <div className={styles.chatModeInfo}>
              <IoSparkles className={styles.chatModeIcon} />
              <span>
                {mode === "quiz"
                  ? "كويز تفاعلي"
                  : mode === "qa"
                    ? "سؤال وجواب"
                    : "الدردشة الذكية"}
              </span>
            </div>
          </div>

          <div className={styles.messagesArea}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.messageWrapper} ${msg.role === "user" ? styles.userMsg : styles.aiMsg}`}
              >
                {msg.role === "assistant" && (
                  <div className={styles.aiAvatar}>
                    <IoSparkles />
                  </div>
                )}
                <div className={styles.messageBubble}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {mode === "quiz" && (
              <div className={styles.generatedCard}>
                <div className={styles.cardHeader}>
                  <IoCheckmarkCircle className={styles.successIcon} />
                  <strong>الكويز جاهز!</strong>
                </div>
                <p>5 أسئلة • اختيار من متعدد • مع التفسير العلمي</p>
                <button className={styles.primaryBtn}>ابدأ الكويز الآن</button>
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="اكتب سؤالك هنا..."
              className={styles.chatInput}
            />
            <button className={styles.sendBtn} onClick={sendMessage}>
              <IoSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFloatingAssistant;
