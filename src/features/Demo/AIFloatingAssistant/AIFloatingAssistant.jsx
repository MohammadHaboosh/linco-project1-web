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
    title: "Chat with Assistant",
    description: "Ask questions about the current lesson",
  },
  {
    id: "quiz",
    icon: IoBulbOutline,
    title: "Topic Specific Quiz",
    description: "Test your understanding with smart questions",
  },
  {
    id: "qa",
    icon: IoCreateOutline,
    title: "Random Course Quiz",
    description: "Comprehensive review with detailed explanations",
  },
];

const AIFloatingAssistant = () => {
  const [mode, setMode] = useState("home");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your AI Assistant 🤖. How can I help you with this course today?",
    },
  ]);

  const openMode = (nextMode) => {
    setMode(nextMode);
    if (nextMode === "quiz") {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Excellent! I am generating 5 interactive questions based on the current lesson. Are you ready?",
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
        text: "Great question! (This is a placeholder response - will be connected to the AI backend later).",
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
            <h3>How can I help you?</h3>
            <p>Select a quick action or start chatting directly.</p>
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
              ← Back
            </button>
            <div className={styles.chatModeInfo}>
              <IoSparkles className={styles.chatModeIcon} />
              <span>
                {mode === "quiz"
                  ? "Interactive Quiz"
                  : mode === "qa"
                    ? "Q&A"
                    : "Smart Chat"}
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
                  <strong>Quiz Ready!</strong>
                </div>
                <p>5 questions • Multiple choice • With explanations</p>
                <button className={styles.primaryBtn}>Start Quiz Now</button>
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question here..."
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
