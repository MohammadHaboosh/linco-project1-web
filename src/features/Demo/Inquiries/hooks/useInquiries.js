import { useCallback, useEffect, useState } from "react";
import { inquiriesApi } from "../api/inquiriesApi";

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
  const [inquiries, setInquiries] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [isLoading, setIsLoading] = useState(Boolean(demoId));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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
        setError(requestError.message || "Failed to fetch inquiries.");
        return false;
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [demoId, fetchPage],
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
      setError(requestError.message || "Failed to fetch more inquiries.");
      return false;
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchPage, isLoadingMore, meta.endCursor, meta.hasNextPage]);

  const refetch = useCallback(() => loadInquiries(), [loadInquiries]);

  return {
    inquiries,
    setInquiries,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage: meta.hasNextPage,
    loadMore,
    refetch,
  };
};
