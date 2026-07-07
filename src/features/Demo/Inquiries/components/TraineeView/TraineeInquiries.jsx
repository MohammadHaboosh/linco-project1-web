import { useState } from "react";
import {
  IoChatbubblesOutline,
  IoAddOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import NewInquiryModal from "./NewInquiryModal";
import styles from "../Inquiries.module.css";
import { useTranslation } from "react-i18next";

const MOCK_MY_INQUIRIES = [
  {
    id: 1,
    subject: "Cannot access React Course",
    to: "Front-End Manager",
    status: "answered",
    date: "Oct 12, 2026",
    message: "I keep getting an error when opening lesson 2.",
    reply: "We have fixed the permission issue. Please try again.",
  },
  {
    id: 2,
    subject: "Certificate Issue",
    to: "Owner",
    status: "pending",
    date: "Oct 14, 2026",
    message: "My name on the certificate has a typo.",
    reply: null,
  },
];

const TraineeInquiries = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState(MOCK_MY_INQUIRIES);

  const handleSendInquiry = (newInquiry) => {
    setInquiries([
      {
        ...newInquiry,
        id: Date.now(),
        status: "pending",
        date: "Today",
        reply: null,
      },
      ...inquiries,
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoChatbubblesOutline className={styles.headerIcon} />
          </div>
          <div>
            <h1 className={styles.title}>{t("my-inquiries")}</h1>
            <p className={styles.description}>
              {t("track-your-support-tickets-complaints-and-questions")}
            </p>
          </div>
        </div>
        <button
          className={styles.primaryBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <IoAddOutline /> {t("new-inquiry")}
        </button>
      </div>

      <div className={styles.ticketsGrid}>
        {inquiries.map((ticket) => (
          <div key={ticket.id} className={styles.ticketCard}>
            <div className={styles.ticketHeader}>
              <span
                className={`${styles.statusBadge} ${ticket.status === "answered" ? styles.answered : styles.pending}`}
              >
                {ticket.status === "answered" ? (
                  <IoCheckmarkDoneOutline />
                ) : (
                  <IoTimeOutline />
                )}
                {ticket.status === "answered" ? t("answered") : t("pending")}
              </span>
              <span className={styles.ticketDate}>{ticket.date}</span>
            </div>

            <h3 className={styles.ticketSubject}>{ticket.subject}</h3>
            <p className={styles.ticketTo}>
              <strong>{t("sent-to")}</strong> {ticket.to}
            </p>

            <div className={styles.ticketMessage}>
              <p>{ticket.message}</p>
            </div>

            {ticket.status === "answered" && (
              <div className={styles.ticketReply}>
                <strong>{t("support-reply")}</strong>
                <p>{ticket.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <NewInquiryModal
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendInquiry}
        />
      )}
    </div>
  );
};

export default TraineeInquiries;
