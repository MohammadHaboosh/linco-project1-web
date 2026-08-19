import { useState } from "react";
import {
  IoHelpCircleOutline,
  IoAddOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
  IoChatboxOutline,
  IoChatbubblesOutline,
} from "react-icons/io5";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NewInquiryModal from "./NewInquiryModal";
import styles from "../Inquiries.module.css";
import { useTranslation } from "react-i18next";
import { useInquiries } from "../../hooks/useInquiries";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const TraineeInquiriesSkeleton = () => (
  <ThemeWrapper>
    <div className={styles.ticketsGrid}>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <article key={index} className={styles.ticketCard}>
            <div className={styles.ticketHeader}>
              <Skeleton width={85} height={26} borderRadius={20} />
              <Skeleton width={90} height={14} borderRadius={4} />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <Skeleton width="80%" height={22} borderRadius={6} />
            </div>
            <div className={styles.ticketMessage}>
              <Skeleton
                width={60}
                height={14}
                style={{ marginBottom: "8px" }}
              />
              <Skeleton
                width="100%"
                height={12}
                count={2}
                style={{ marginBottom: "4px" }}
              />
              <Skeleton width="60%" height={12} />
            </div>
          </article>
        ))}
    </div>
  </ThemeWrapper>
);

const TraineeInquiries = ({ demoId }) => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    inquiries,
    isLoading,
    isLoadingMore,
    isCreatingInquiry,
    error,
    hasNextPage,
    loadMore,
    refetch,
    createInquiry,
  } = useInquiries({ demoId, scope: "member" });
  const locale = i18n.resolvedLanguage || i18n.language || "en";

  const formatDate = (value) => {
    if (!value) return t("date-not-available");

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t("date-not-available");

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const handleSendInquiry = async (newInquiry) => {
    await createInquiry(newInquiry);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoHelpCircleOutline className={styles.headerIcon} />
          </div>
          <div>
            <h1 className={styles.title}>{t("my-inquiries")}</h1>
            <p className={styles.description}>
              {t("track-your-support-tickets-complaints-and-questions")}
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <IoAddOutline /> {t("new-inquiry")}
        </button>
      </div>

      {isLoading ? (
        <TraineeInquiriesSkeleton />
      ) : error && inquiries.length === 0 ? (
        <div className={styles.emptyStatePremium} role="alert">
          <IoChatbubblesOutline />
          <h3>{t("failed-to-load-inquiries")}</h3>
          <p>{error}</p>
          <button type="button" className={styles.primaryBtn} onClick={refetch}>
            {t("try-again")}
          </button>
        </div>
      ) : inquiries.length === 0 ? (
        <div className={styles.emptyStatePremium} role="status">
          <IoChatboxOutline />
          <h3>{t("no-inquiries-found")}</h3>
          <p>{t("no-inquiries-description")}</p>
        </div>
      ) : (
        <>
          <div className={styles.ticketsGrid}>
            {inquiries.map((inquiry) => (
              <article key={inquiry.id} className={styles.ticketCard}>
                <div className={styles.ticketHeader}>
                  <span
                    className={`${styles.statusBadge} ${inquiry.status === "answered" ? styles.answered : styles.pending}`}
                  >
                    {inquiry.status === "answered" ? (
                      <IoCheckmarkDoneOutline />
                    ) : (
                      <IoTimeOutline />
                    )}
                    {inquiry.status === "answered"
                      ? t("answered")
                      : t("pending")}
                  </span>
                  <span className={styles.ticketDate}>
                    {formatDate(inquiry.createdAt)}
                  </span>
                </div>

                <h3 className={styles.ticketSubject}>{inquiry.subject}</h3>

                <div className={styles.ticketMessage}>
                  <strong>{t("question")}</strong>
                  <p>{inquiry.question}</p>
                </div>

                {inquiry.response && (
                  <div className={styles.ticketReply}>
                    <strong>{t("response")}</strong>
                    <p>{inquiry.response}</p>
                  </div>
                )}
              </article>
            ))}
          </div>

          {hasNextPage && (
            <div className={styles.loadMoreRow}>
              <button
                type="button"
                className={styles.loadMoreButton}
                onClick={loadMore}
                disabled={isLoadingMore}
                aria-busy={isLoadingMore}
              >
                {isLoadingMore ? t("loading-inquiries") : t("load-more")}
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <NewInquiryModal
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendInquiry}
          isSubmitting={isCreatingInquiry}
        />
      )}
    </div>
  );
};

export default TraineeInquiries;
