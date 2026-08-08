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
    question: "I finished the course but didn't receive the certificate. When will it be available?",
    date: "10:30 AM",
    status: "pending",
    response: null,
  },
  {
    id: 102,
    from: "Sara Majed",
    role: "Trainee",
    subject: "Login Issue",
    question: "Why can't I access the weekly tasks section?",
    date: "Yesterday",
    status: "answered",
    response: "Please clear your browser cache, sign in again, and retry.",
  },
];

const ManagerInbox = () => {
  const { t } = useTranslation();
  const [inquiries, setInquiries] = useState(MOCK_INBOX);
  const [activeInquiryId, setActiveInquiryId] = useState(MOCK_INBOX[0]?.id);
  const [responseText, setResponseText] = useState("");
  const activeInquiry = inquiries.find(
    (inquiry) => inquiry.id === activeInquiryId,
  );

  const handleSelectInquiry = (inquiryId) => {
    setActiveInquiryId(inquiryId);
    setResponseText("");
  };

  const handleSendResponse = () => {
    const response = responseText.trim();
    if (!response || !activeInquiry || activeInquiry.response) return;

    setInquiries((currentInquiries) =>
      currentInquiries.map((inquiry) =>
        inquiry.id === activeInquiry.id
          ? { ...inquiry, response, status: "answered" }
          : inquiry,
      ),
    );
    setResponseText("");
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
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`${styles.inboxItem} ${activeInquiry?.id === inquiry.id ? styles.inboxItemActive : ""}`}
                onClick={() => handleSelectInquiry(inquiry.id)}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.senderName}>{inquiry.from}</span>
                  <span className={styles.itemDate}>{inquiry.date}</span>
                </div>
                <div className={styles.itemSubject}>{inquiry.subject}</div>
                <span
                  className={`${styles.statusDot} ${inquiry.status === "pending" ? styles.dotPending : styles.dotAnswered}`}
                >
                  {inquiry.status === "answered" ? t("answered") : t("pending")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.inboxDetail}>
          {activeInquiry ? (
            <>
              <div className={styles.detailHeader}>
                <h2>{activeInquiry.subject}</h2>
                <div className={styles.senderInfo}>
                  <IoPersonCircleOutline className={styles.senderAvatar} />
                  <div>
                    <strong>{activeInquiry.from}</strong>
                    <span>{activeInquiry.role}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailContent}>
                <section className={styles.questionPanel}>
                  <strong className={styles.panelLabel}>{t("question")}</strong>
                  <p>{activeInquiry.question}</p>
                  <span className={styles.panelMeta}>{activeInquiry.date}</span>
                </section>

                {activeInquiry.response && (
                  <section className={styles.responsePanel}>
                    <strong className={styles.panelLabel}>{t("response")}</strong>
                    <p>{activeInquiry.response}</p>
                    <span className={styles.panelMeta}>{t("support-team")}</span>
                  </section>
                )}
              </div>

              {!activeInquiry.response && (
                <div className={styles.responseArea}>
                  <textarea
                    placeholder={t("write-your-response-here")}
                    value={responseText}
                    onChange={(event) => setResponseText(event.target.value)}
                    rows="3"
                  />
                  <div className={styles.responseActions}>
                    <button
                      className={styles.sendResponseBtn}
                      onClick={handleSendResponse}
                      disabled={!responseText.trim()}
                    >
                      <IoSendOutline /> {t("send-response")}
                    </button>
                  </div>
                </div>
              )}
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
