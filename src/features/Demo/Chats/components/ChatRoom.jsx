import { useState } from "react";
import {
  IoSend,
  IoAttachOutline,
  IoHappyOutline,
  IoArrowBack,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import styles from "./Chats.module.css";

const ChatRoom = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const MOCK_MESSAGES = [
    {
      id: 1,
      sender: "Omar Nabil",
      text: "Hey everyone! Did you see the new React updates?",
      time: "10:15 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      text: "Yes, the Concurrent Mode looks promising!",
      time: "10:20 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "Sara Majed",
      text: "I'll start implementing the new hooks tomorrow.",
      time: "10:22 AM",
      isMe: false,
    },
  ];

  return (
    <div className={styles.roomContainer}>
      {/* رأس الدردشة */}
      <div className={styles.roomHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <IoArrowBack />
          </button>
          <div className={styles.roomAvatar}>F</div>
          <div>
            <h3 className={styles.roomTitle}>Front-End Developers</h3>
            <span className={styles.onlineStatus}>12 members • 5 online</span>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className={styles.messagesArea}>
        {MOCK_MESSAGES.map((m) => (
          <div
            key={m.id}
            className={`${styles.messageRow} ${m.isMe ? styles.rowMe : styles.rowThem}`}
          >
            {!m.isMe && (
              <div className={styles.senderAvatarSmall}>
                {m.sender.charAt(0)}
              </div>
            )}
            <div className={styles.messageContent}>
              {!m.isMe && <span className={styles.senderName}>{m.sender}</span>}
              <div className={styles.messageBubble}>
                <p>{m.text}</p>
                <span className={styles.msgTime}>{m.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* حقل الإدخال */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <button className={styles.actionIcon}>
            <IoAttachOutline />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button className={styles.actionIcon}>
            <IoHappyOutline />
          </button>
          <button className={styles.sendBtn} disabled={!msg.trim()}>
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
