import { useState } from "react";
import {
  IoMailUnreadOutline,
  IoSearchOutline,
  IoSendOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import styles from "../Inquiries.module.css";
import { useTranslation } from "react-i18next";

const MOCK_INBOX = [
  {
    id: 101,
    from: "Omar Nabil",
    role: "Trainee",
    subject: "Missing Certificate",
    message: "Hello, I finished the course but didn't receive the certificate.",
    date: "10:30 AM",
    status: "pending",
  },
  {
    id: 102,
    from: "Sara Majed",
    role: "Trainee",
    subject: "Login Issue",
    message: "I can't access the weekly tasks section.",
    date: "Yesterday",
    status: "answered",
    reply: "Try clearing your browser cache.",
  },
];

const ManagerInbox = ({ role }) => {
  const { t } = useTranslation();
  const [activeTicket, setActiveTicket] = useState(MOCK_INBOX[0]);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    // TODO :
    if (!replyText.trim()) return;
    console.log("Replying to ticket", activeTicket.id, "with:", replyText);
    setReplyText("");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoMailUnreadOutline className={styles.headerIcon} />
          </div>
          <div>
            <h1 className={styles.title}>{t("support-inbox")}</h1>
            <p className={styles.description}>
              {t("manage-incoming-inquiries-and-complaints-from-trainees")}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.inboxLayout}>
        <div className={styles.inboxSidebar}>
          <div className={styles.searchContainer}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search-tickets")}
              className={styles.inboxSearch}
            />
          </div>

          <div className={styles.ticketsList}>
            {MOCK_INBOX.map((ticket) => (
              <div
                key={ticket.id}
                className={`${styles.inboxItem} ${activeTicket?.id === ticket.id ? styles.inboxItemActive : ""}`}
                onClick={() => setActiveTicket(ticket)}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.senderName}>{ticket.from}</span>
                  <span className={styles.itemDate}>{ticket.date}</span>
                </div>
                <div className={styles.itemSubject}>{ticket.subject}</div>
                <span
                  className={`${styles.statusDot} ${ticket.status === "pending" ? styles.dotPending : styles.dotAnswered}`}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.inboxDetail}>
          {activeTicket ? (
            <>
              <div className={styles.detailHeader}>
                <h2>{activeTicket.subject}</h2>
                <div className={styles.senderInfo}>
                  <IoPersonCircleOutline className={styles.senderAvatar} />
                  <div>
                    <strong>{activeTicket.from}</strong>
                    <span>{activeTicket.role}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailMessages}>
                <div className={styles.messageBubble}>
                  <p>{activeTicket.message}</p>
                  <span className={styles.msgTime}>{activeTicket.date}</span>
                </div>

                {activeTicket.status === "answered" && (
                  <div className={styles.replyBubble}>
                    <p>{activeTicket.reply}</p>
                    <span className={styles.msgTime}>{t("support-team")}</span>
                  </div>
                )}
              </div>

              <div className={styles.replyArea}>
                <textarea
                  placeholder={t("write-your-response-here")}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="3"
                ></textarea>
                <div className={styles.replyActions}>
                  <button
                    className={styles.sendReplyBtn}
                    onClick={handleSendReply}
                  >
                    <IoSendOutline /> {t("send-reply")}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyInbox}>
              {t("select-a-ticket-to-view-details")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerInbox;
