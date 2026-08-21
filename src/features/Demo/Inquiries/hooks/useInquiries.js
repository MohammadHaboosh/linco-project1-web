import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { inquiriesApi } from "../api/inquiriesApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

const EMPTY_META = {
  hasNextPage: false,
  endCursor: null,
};

const getPersonName = (member) => {
  const user = member?.user;
  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user?.email || "";
};

const normalizeInquiry = (inquiry) => {
  const response = inquiry?.reply?.message || null;

  return {
    id: inquiry?.id,
    subject: inquiry?.subject || "",
    question: inquiry?.message || "",
    response,
    status:
      response || String(inquiry?.status || "").toUpperCase() === "ANSWERED"
        ? "answered"
        : "pending",
    createdAt: inquiry?.createdAt || null,
    updatedAt: inquiry?.updatedAt || null,
    creator: inquiry?.creator || null,
    creatorName: getPersonName(inquiry?.creator),
    creatorRole: inquiry?.creator?.role || "",
    creatorImagePath: inquiry?.creator?.user?.imagePath || "",
    responseSender: inquiry?.reply?.sender || null,
    responseSenderName: getPersonName(inquiry?.reply?.sender),
    responseCreatedAt: inquiry?.reply?.createdAt || null,
  };
};

const mergeInquiriesById = (currentInquiries, incomingInquiries) => {
  const inquiryMap = new Map(
    currentInquiries.map((inquiry) => [inquiry.id, inquiry]),
  );

  incomingInquiries.forEach((inquiry) => {
    if (inquiry.id) {
      inquiryMap.set(inquiry.id, inquiry);
    }
  });

  return Array.from(inquiryMap.values());
};

export const useInquiries = ({ demoId, scope }) => {
  const { t } = useTranslation();
  const [inquiries, setInquiries] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [isLoading, setIsLoading] = useState(Boolean(demoId));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCreatingInquiry, setIsCreatingInquiry] = useState(false);
  const [replyingInquiryId, setReplyingInquiryId] = useState(null);
  const [error, setError] = useState("");

  const fetchPage = useCallback(
    (options) => {
      const request =
        scope === "manager"
          ? inquiriesApi.getManagerInquiries
          : inquiriesApi.getMemberInquiries;

      return request(demoId, options);
    },
    [demoId, scope],
  );

  const loadInquiries = useCallback(
    async ({ signal } = {}) => {
      if (!demoId) {
        setInquiries([]);
        setMeta(EMPTY_META);
        setIsLoading(false);
        return false;
      }

      setIsLoading(true);
      setError("");

      try {
        const result = await fetchPage({ signal });
        if (signal?.aborted) return false;

        setInquiries(result.data.map(normalizeInquiry));
        setMeta(result.meta);
        return true;
      } catch (requestError) {
        if (requestError.name === "AbortError") return false;

        setInquiries([]);
        setMeta(EMPTY_META);
        setError(
          getApiErrorMessage(requestError, t("inquiries-load-failed")),
        );
        return false;
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [demoId, fetchPage, t],
  );

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() =>
      loadInquiries({ signal: controller.signal }),
    );

    return () => controller.abort();
  }, [loadInquiries]);

  const loadMore = useCallback(async () => {
    if (!meta.hasNextPage || !meta.endCursor || isLoadingMore) {
      return false;
    }

    setIsLoadingMore(true);
    setError("");

    try {
      const result = await fetchPage({ cursor: meta.endCursor });
      const normalizedInquiries = result.data.map(normalizeInquiry);
      setInquiries((currentInquiries) =>
        mergeInquiriesById(currentInquiries, normalizedInquiries),
      );
      setMeta(result.meta);
      return true;
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          t("more-inquiries-load-failed"),
        ),
      );
      return false;
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchPage, isLoadingMore, meta.endCursor, meta.hasNextPage, t]);

  const refetch = useCallback(() => loadInquiries(), [loadInquiries]);

  const createInquiry = useCallback(
    async ({ subject, question }) => {
      setIsCreatingInquiry(true);

      try {
        const createdInquiry = await inquiriesApi.createInquiry(demoId, {
          subject,
          message: question,
        });
        const normalizedInquiry = normalizeInquiry(createdInquiry);

        setInquiries((currentInquiries) => [
          normalizedInquiry,
          ...currentInquiries.filter(
            (inquiry) => inquiry.id !== normalizedInquiry.id,
          ),
        ]);

        return normalizedInquiry;
      } finally {
        setIsCreatingInquiry(false);
      }
    },
    [demoId],
  );

  const replyToInquiry = useCallback(
    async (inquiryId, message) => {
      setReplyingInquiryId(inquiryId);

      try {
        const createdReply = await inquiriesApi.createInquiryReply(
          demoId,
          inquiryId,
          message,
        );

        setInquiries((currentInquiries) =>
          currentInquiries.map((inquiry) =>
            inquiry.id === inquiryId
              ? {
                  ...inquiry,
                  response: createdReply.message || "",
                  status: "answered",
                  responseSender: createdReply.sender || null,
                  responseSenderName: getPersonName(createdReply.sender),
                  responseCreatedAt: createdReply.createdAt || null,
                }
              : inquiry,
          ),
        );

        return createdReply;
      } finally {
        setReplyingInquiryId(null);
      }
    },
    [demoId],
  );

  return {
    inquiries,
    isLoading,
    isLoadingMore,
    isCreatingInquiry,
    replyingInquiryId,
    error,
    hasNextPage: meta.hasNextPage,
    loadMore,
    refetch,
    createInquiry,
    replyToInquiry,
  };
};
