import { useMemo, useState } from "react";
import {
  IoMailUnreadOutline,
  IoSearchOutline,
  IoSendOutline,
  IoPersonCircleOutline,
  IoInboxOutline,
} from "react-icons/io5";
import styles from "../Inquiries.module.css";
import { useTranslation } from "react-i18next";
import { useInquiries } from "../../hooks/useInquiries";
import { ManagerInboxSkeleton } from "../InquiriesSkeletons";

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
    } catch {
      setResponseError(t("failed-to-send-response"));
    }
  };

  return (
    <div className={styles.pageContainer} dir={i18n.dir()}>
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
          <IoInboxOutline />
          <h3>{t("failed-to-load-inquiries")}</h3>
          <p>{error}</p>
          <button type="button" className={styles.primaryBtn} onClick={refetch}>
            {t("try-again")}
          </button>
        </div>
      ) : inquiries.length === 0 ? (
        <div className={styles.emptyStatePremium} role="status">
          <IoInboxOutline />
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
