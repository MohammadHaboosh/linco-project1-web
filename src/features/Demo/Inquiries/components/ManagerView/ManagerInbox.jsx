import { useMemo, useState } from "react";
import {
  IoMailUnreadOutline,
  IoSearchOutline,
  IoSendOutline,
  IoPersonCircleOutline,
  IoMailOutline,
} from "react-icons/io5";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../Inquiries.module.css";
import { useTranslation } from "react-i18next";
import { useInquiries } from "../../hooks/useInquiries";
import { getApiErrorMessage } from "../../../../../utils/getApiErrorMessage";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const ManagerInboxSkeleton = () => (
  <ThemeWrapper>
    <div className={styles.inboxLayout}>
      <div className={styles.inboxSidebar}>
        <div className={styles.searchContainer}>
          <Skeleton height={42} borderRadius={100} />
        </div>
        <div className={styles.ticketsList}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={styles.inboxItem}>
                <div className={styles.itemHeader}>
                  <Skeleton width={110} height={16} borderRadius={4} />
                  <Skeleton width={60} height={12} borderRadius={4} />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <Skeleton width="85%" height={14} borderRadius={4} />
                </div>
                <Skeleton width={65} height={22} borderRadius={6} />
              </div>
            ))}
        </div>
      </div>

      <div className={styles.inboxDetail}>
        <div className={styles.detailHeader}>
          <div style={{ marginBottom: "16px" }}>
            <Skeleton width="60%" height={28} borderRadius={6} />
          </div>
          <div className={styles.senderInfo}>
            <Skeleton circle width={42} height={42} />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <Skeleton width={130} height={16} borderRadius={4} />
              <Skeleton width={80} height={12} borderRadius={4} />
            </div>
          </div>
        </div>

        <div className={styles.detailContent} style={{ overflow: "hidden" }}>
          <section className={styles.questionPanel}>
            <Skeleton width={70} height={14} style={{ marginBottom: "12px" }} />
            <Skeleton
              width="100%"
              height={12}
              count={3}
              style={{ marginBottom: "6px" }}
            />
            <Skeleton
              width="50%"
              height={12}
              style={{ marginBottom: "16px" }}
            />
            <Skeleton width={90} height={12} />
          </section>
        </div>

        <div className={styles.responseArea}>
          <Skeleton height={90} borderRadius={12} />
          <div className={styles.responseActions}>
            <Skeleton width={140} height={42} borderRadius={12} />
          </div>
        </div>
      </div>
    </div>
  </ThemeWrapper>
);

const ManagerInbox = ({ demoId }) => {
  const { t, i18n } = useTranslation();
  const {
    inquiries,
    isLoading,
    isLoadingMore,
    replyingInquiryId,
    error,
    hasNextPage,
    loadMore,
    refetch,
    replyToInquiry,
  } = useInquiries({ demoId, scope: "manager" });

  const [activeInquiryId, setActiveInquiryId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [responseError, setResponseError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const activeInquiry =
    inquiries.find((inquiry) => inquiry.id === activeInquiryId) ||
    inquiries[0] ||
    null;
  const filteredInquiries = useMemo(
    () =>
      inquiries.filter((inquiry) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;

        return [inquiry.subject, inquiry.question, inquiry.creatorName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      }),
    [inquiries, searchQuery],
  );

  const formatDate = (value) => {
    if (!value) return t("date-not-available");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t("date-not-available");
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getTranslatedRole = (role) => {
    const normalizedRole = String(role ?? "").toUpperCase();
    if (normalizedRole === "OWNER") return t("owner");
    if (["ADMIN", "MANAGER"].includes(normalizedRole)) return t("admin");
    if (normalizedRole === "MEMBER") return t("member");
    return t("trainee");
  };

  const handleSelectInquiry = (inquiryId) => {
    setActiveInquiryId(inquiryId);
    setResponseText("");
    setResponseError("");
  };

  const handleSendResponse = async (event) => {
    event?.preventDefault();
    const response = responseText.trim();
    if (
      !response ||
      !activeInquiry ||
      activeInquiry.response ||
      replyingInquiryId === activeInquiry.id
    ) {
      return;
    }

    setResponseError("");
    try {
      await replyToInquiry(activeInquiry.id, response);
      setResponseText("");
    } catch (requestError) {
      setResponseError(
        getApiErrorMessage(
          requestError,
          t("failed-to-send-response"),
        ),
      );
    }
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

      {isLoading ? (
        <ManagerInboxSkeleton />
      ) : error && inquiries.length === 0 ? (
        <div className={styles.emptyStatePremium} role="alert">
          <IoMailOutline />
          <h3>{t("failed-to-load-inquiries", "فشل في تحميل صندوق الوارد")}</h3>
          <p>{error}</p>
          <button type="button" className={styles.primaryBtn} onClick={refetch}>
            {t("try-again")}
          </button>
        </div>
      ) : inquiries.length === 0 ? (
        <div className={styles.emptyStatePremium} role="status">
          <IoMailOutline />
          <h3>{t("no-inquiries-found")}</h3>
          <p>{t("manager-no-inquiries-desc")}</p>
        </div>
      ) : (
        <div className={styles.inboxLayout}>
          <div className={styles.inboxSidebar}>
            <div className={styles.searchContainer}>
              <IoSearchOutline className={styles.searchIcon} />
              <input
                type="search"
                placeholder={t("search-tickets")}
                aria-label={t("search-inquiries")}
                className={styles.inboxSearch}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className={styles.ticketsList}>
              {filteredInquiries.length === 0 ? (
                <div className={styles.listState} role="status">
                  {t("no-inquiries-found")}
                </div>
              ) : (
                <>
                  {filteredInquiries.map((inquiry) => (
                    <button
                      type="button"
                      key={inquiry.id}
                      className={`${styles.inboxItem} ${activeInquiry?.id === inquiry.id ? styles.inboxItemActive : ""}`}
                      onClick={() => handleSelectInquiry(inquiry.id)}
                      aria-pressed={activeInquiry?.id === inquiry.id}
                      aria-label={t("open-inquiry", {
                        subject: inquiry.subject,
                      })}
                    >
                      <div className={styles.itemHeader}>
                        <span className={styles.senderName}>
                          {inquiry.creatorName || t("unknown-user")}
                        </span>
                        <span className={styles.itemDate}>
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>
                      <div className={styles.itemSubject}>
                        {inquiry.subject}
                      </div>
                      <span
                        className={`${styles.statusDot} ${inquiry.status === "pending" ? styles.dotPending : styles.dotAnswered}`}
                      >
                        {inquiry.status === "answered"
                          ? t("answered")
                          : t("pending")}
                      </span>
                    </button>
                  ))}

                  {hasNextPage && (
                    <button
                      type="button"
                      className={styles.loadMoreButton}
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      aria-busy={isLoadingMore}
                    >
                      {isLoadingMore ? t("loading-inquiries") : t("load-more")}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.inboxDetail}>
            {activeInquiry ? (
              <>
                <div className={styles.detailHeader}>
                  <h2>{activeInquiry.subject}</h2>
                  <div className={styles.senderInfo}>
                    {activeInquiry.creatorImagePath ? (
                      <img
                        src={activeInquiry.creatorImagePath}
                        alt=""
                        className={styles.senderAvatarImage}
                      />
                    ) : (
                      <IoPersonCircleOutline className={styles.senderAvatar} />
                    )}
                    <div>
                      <strong>
                        {activeInquiry.creatorName || t("unknown-user")}
                      </strong>
                      <span>
                        {getTranslatedRole(activeInquiry.creatorRole)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailContent}>
                  <section className={styles.questionPanel}>
                    <strong className={styles.panelLabel}>
                      {t("question")}
                    </strong>
                    <p>{activeInquiry.question}</p>
                    <span className={styles.panelMeta}>
                      {formatDate(activeInquiry.createdAt)}
                    </span>
                  </section>

                  {activeInquiry.response && (
                    <section className={styles.responsePanel}>
                      <strong className={styles.panelLabel}>
                        {t("response")}
                      </strong>
                      <p>{activeInquiry.response}</p>
                      <span className={styles.panelMeta}>
                        {t("inquiry-response-meta", {
                          name:
                            activeInquiry.responseSenderName ||
                            t("support-team"),
                          date: formatDate(activeInquiry.responseCreatedAt),
                        })}
                      </span>
                    </section>
                  )}
                </div>

                {!activeInquiry.response && (
                  <form
                    className={styles.responseArea}
                    onSubmit={handleSendResponse}
                    aria-busy={replyingInquiryId === activeInquiry.id}
                  >
                    <label
                      className={styles.visuallyHidden}
                      htmlFor="inquiry-response"
                    >
                      {t("response")}
                    </label>
                    <textarea
                      id="inquiry-response"
                      placeholder={t("write-your-response-here")}
                      value={responseText}
                      onChange={(event) => {
                        setResponseText(event.target.value);
                        setResponseError("");
                      }}
                      rows="3"
                      disabled={replyingInquiryId === activeInquiry.id}
                    />
                    {responseError && (
                      <div className={styles.responseError} role="alert">
                        {responseError}
                      </div>
                    )}
                    <div className={styles.responseActions}>
                      <button
                        type="submit"
                        className={styles.sendResponseBtn}
                        disabled={
                          !responseText.trim() ||
                          replyingInquiryId === activeInquiry.id
                        }
                        aria-busy={replyingInquiryId === activeInquiry.id}
                      >
                        <IoSendOutline />
                        {replyingInquiryId === activeInquiry.id
                          ? t("sending-response")
                          : t("send-response")}
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <div className={styles.emptyInbox}>
                <IoMailUnreadOutline
                  style={{
                    fontSize: "4rem",
                    color: "var(--app-border-strong)",
                    marginBottom: "12px",
                  }}
                />
                {t("select-a-ticket-to-view-details")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerInbox;
