import { useMemo, useState } from "react";
import {
  IoMailUnreadOutline,
  IoSearchOutline,
  IoSendOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import styles from "../Inquiries.module.css";
import { useTranslation } from "react-i18next";
import { useInquiries } from "../../hooks/useInquiries";

const ManagerInbox = ({ demoId }) => {
  const { t, i18n } = useTranslation();
  const {
    inquiries,
    setInquiries,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    loadMore,
    refetch,
  } = useInquiries({ demoId, scope: "manager" });
  const [activeInquiryId, setActiveInquiryId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

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
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className={styles.ticketsList}>
            {isLoading ? (
              <div className={styles.listState}>{t("loading-inquiries")}</div>
            ) : error && inquiries.length === 0 ? (
              <div className={styles.listState} role="alert">
                <p>{error}</p>
                <button type="button" onClick={refetch}>
                  {t("try-again")}
                </button>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className={styles.listState}>{t("no-inquiries-found")}</div>
            ) : (
              <>
                {filteredInquiries.map((inquiry) => (
                  <button
                    type="button"
                    key={inquiry.id}
                    className={`${styles.inboxItem} ${activeInquiry?.id === inquiry.id ? styles.inboxItemActive : ""}`}
                    onClick={() => handleSelectInquiry(inquiry.id)}
                  >
                    <div className={styles.itemHeader}>
                      <span className={styles.senderName}>
                        {inquiry.creatorName || t("unknown-user")}
                      </span>
                      <span className={styles.itemDate}>
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </div>
                    <div className={styles.itemSubject}>{inquiry.subject}</div>
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
                  >
                    {isLoadingMore ? t("loading-inquiries") : t("load-more")}
                  </button>
                )}
              </>
            )}

            {error && inquiries.length > 0 && (
              <div className={styles.inlineError} role="alert">
                {error}
              </div>
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
                    <span>{activeInquiry.creatorRole || t("trainee")}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailContent}>
                <section className={styles.questionPanel}>
                  <strong className={styles.panelLabel}>{t("question")}</strong>
                  <p>{activeInquiry.question}</p>
                  <span className={styles.panelMeta}>
                    {formatDate(activeInquiry.createdAt)}
                  </span>
                </section>

                {activeInquiry.response && (
                  <section className={styles.responsePanel}>
                    <strong className={styles.panelLabel}>{t("response")}</strong>
                    <p>{activeInquiry.response}</p>
                    <span className={styles.panelMeta}>
                      {activeInquiry.responseSenderName || t("support-team")}
                    </span>
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
