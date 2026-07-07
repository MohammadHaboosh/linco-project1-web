import { useState } from "react";
import {
  IoSend,
  IoAttachOutline,
  IoHappyOutline,
  IoEllipsisVertical,
} from "react-icons/io5";
import styles from "./Chats.module.css";
import { useTranslation } from "react-i18next";

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
    text: "Yes, the Concurrent Mode looks promising! We should use it.",
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

const ChatArea = ({ group }) => {
  const { t } = useTranslation();
  const [msg, setMsg] = useState("");

  return (
    <div className={styles.chatRoomWrapper}>
      <div className={styles.roomHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.roomAvatar}>{group.name.charAt(0)}</div>
          <div className={styles.roomMeta}>
            <h3>{group.name}</h3>
            <span>
              {group.members} {t("members")}
            </span>
          </div>
        </div>
        <button className={styles.menuBtn}>
          <IoEllipsisVertical />
        </button>
      </div>

      <div className={styles.messagesScrollArea}>
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

      <div className={styles.inputStickyArea}>
        <div className={styles.inputWrapper}>
          <button className={styles.actionIcon}>
            <IoAttachOutline />
          </button>
          <input
            type="text"
            placeholder={t("write-your-message")}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button className={styles.actionIcon}>
            <IoHappyOutline />
          </button>
          <button
            className={`${styles.sendBtn} ${msg.trim() ? styles.sendBtnActive : ""}`}
            disabled={!msg.trim()}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
